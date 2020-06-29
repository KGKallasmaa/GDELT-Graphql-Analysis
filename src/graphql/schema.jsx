const { buildSchema } = require('graphql');

module.exports = buildSchema(`
"""
##################### Everything #####################
"""
type Master {
    GLOBALEVENTID: String
    SQLDATE: String
    MonthYear: String
    Year: String
    FractionDate: Float
    Actor1Code: String
    Actor1Name:String
    Actor1CountryCode: String
    Actor1KnownGroupCode: String
    Actor1EthnicCode: String
    Actor1Religion1Code: String
    Actor1Religion2Code: String
    Actor1Type1Code: String
    Actor1Type2Code: String
    Actor1Type3Code: String
    Actor2Code: String
    Actor2Name: String
    Actor2CountryCode: String
    Actor2KnownGroupCode: String
    Actor2EthnicCode: String
    Actor2Religion1Code: String
    Actor2Religion2Code: String
    Actor2Type1Code:String
    Actor2Type2Code:String
    Actor2Type3Code:String
    IsRootEvent: String
    EventCode: String
    EventBaseCode: String
    EventRootCode:String
    QuadClass:String
    GoldsteinScale: String
    NumMentions: Int
    NumSources: Int
    NumArticles: Int
    AvgTone: Float
    Actor1Geo_Type: String
    Actor1Geo_FullName: String
    Actor1Geo_CountryCode: String
    Actor1Geo_ADM1Code: String
    Actor1Geo_ADM2Code: String
    Actor1Geo_Lat: Float
    Actor1Geo_Long: Float
    Actor1Geo_FeatureID: String
    Actor2Geo_Type: String
    Actor2Geo_FullName: String
    Actor2Geo_CountryCode: String
    Actor2Geo_ADM1Code:String
    Actor2Geo_ADM2Code:String
    Actor2Geo_Lat: Float
    Actor2Geo_Long: Float
    Actor2Geo_FeatureID:String
    ActionGeo_Type: String
    ActionGeo_FullName: String
    ActionGeo_CountryCode:String
    ActionGeo_ADM1Code: String
    ActionGeo_ADM2Code: String
    ActionGeo_Lat: Float
    ActionGeo_Long: Float
    ActionGeo_FeatureID: String
    DATEADDED: String
    SOURCEURL: String
}
type Top{
  SQLDATE:String!,
  events: [Master!]
}

"""
##################### Root Query #####################
"""
type RootQuery {
    everything:[Master!]
    top_nr_score(n:Int):[Master!]
    get_results_between_time_periods(FractionDate_start:Float,FractionDate_end:Float):[Master!]
    get_results_between_tones(min_tone:Float,max_tone:Float):[Master!]
    get_actions_month(month:String):[Master!]
    
    get_top_n_actors_with_most_mentions_per_day(n:Int,start_SQLDATE:String,end_SQLDATE:String):[Top!]
    get_top_n_negative_actors_near_location(n:Int,
                                            actor1Geo_Lat:Float,actor1Geo_Long:Float,
                                            start_SQLDATE:String,end_SQLDATE:String):[Top!]
                                            
                                            
    find_n_most_powerful_actor_events_using_pagerank_between_two_dates(n:Int,start_SQLDATE:String,end_SQLDATE:String):[Master!]                                      
}


schema {
    query: RootQuery
}
`);
