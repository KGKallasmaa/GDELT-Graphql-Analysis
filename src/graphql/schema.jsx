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
    FractionDate: String
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
    NumMentions: String
    NumSources: String
    NumArticles: String
    AvgTone: String
    Actor1Geo_Type: String
    Actor1Geo_FullName: String
    Actor1Geo_CountryCode: String
    Actor1Geo_ADM1Code: String
    Actor1Geo_Lat: String
    Actor1Geo_Long: String
    Actor1Geo_FeatureID: String
    Actor2Geo_Type: String
    Actor2Geo_FullName: String
    Actor2Geo_CountryCode: String
    Actor2Geo_ADM1Code:String
    Actor2Geo_Lat: String
    Actor2Geo_Long: String
    Actor2Geo_FeatureID:String
    ActionGeo_Type: String
    ActionGeo_FullName: String
    ActionGeo_CountryCode:String
    ActionGeo_ADM1Code: String
    ActionGeo_Lat: String
    ActionGeo_Long: String
    ActionGeo_FeatureID: String
    DATEADDED: String
    SOURCEURL: String
    
}

"""
##################### Root Query #####################
"""
type RootQuery {
    everything:[Master!]
    top_nr_score(n:Int):[Master!]
}


schema {
    query: RootQuery

}
`);
