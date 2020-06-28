function actor1_pagerank(values) {
  let actorname_nr = {}; // Key = actor_name  Value = Actor nr
  let graph = require('pagerank.js');

  let actor_nr = 0;
  for (let i = 0; i < values.length; i++) {
    const single_res = values[i];
    const actor1_Name = single_res['Actor1Name'];
    const actor2_Name = single_res['Actor2Name'];

    const act1_is_not_undefined_or_null = actor1_Name !== undefined && actor1_Name !== null;
    const act2_is_not_undefined_or_null = actor2_Name !== undefined && actor2_Name !== null;
    const act1_and_ac2_are_not_equal = actor1_Name !== actor2_Name;

    if (act1_is_not_undefined_or_null && act2_is_not_undefined_or_null && act1_and_ac2_are_not_equal) {
      let actor1_code = actorname_nr[actor1_Name];
      let actor2_code = actorname_nr[actor2_Name];

      if (actor1_code === undefined) {
        actor1_code = actor_nr;
        actorname_nr[actor1_Name] = actor_nr;
        actor_nr += 1;
      }
      if (actor2_code === undefined) {
        actor2_code = actor_nr;
        actorname_nr[actor2_Name] = actor_nr;
        actor_nr += 1;
      }
      graph.link(actor1_Name, actor2_Name, 1.0);
    }
  }

  let actorname_pagerank = {};
  graph.rank(0.85, 0.000001, function (node, rank) {
    actorname_pagerank[node] = rank;
  });
  return actorname_pagerank;
}
exports.actor1_pagerank = actor1_pagerank;
