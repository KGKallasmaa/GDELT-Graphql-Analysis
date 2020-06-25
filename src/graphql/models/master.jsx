const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema(
  {
    GLOBALEVENTID: {
      type: String,
    },
    SQLDATE: {
      type: String,
    },
    MonthYear: {
      type: String,
    },
    Year: {
      type: String,
    },
    FractionDate: {
      type: Number,
    },
    Actor1Code: {
      type: String,
    },
    Actor1Name: {
      type: String,
    },
    Actor1CountryCode: {
      type: String,
    },
    Actor1KnownGroupCode: {
      type: String,
    },
    Actor1EthnicCode: {
      type: String,
    },
    Actor1Religion1Code: {
      type: String,
    },
    Actor1Religion2Code: {
      type: String,
    },
    Actor1Type1Code: {
      type: String,
    },
    Actor1Type2Code: {
      type: String,
    },
    Actor1Type3Code: {
      type: String,
    },
    Actor2Code: {
      type: String,
    },
    Actor2Name: {
      type: String,
    },
    Actor2CountryCode: {
      type: String,
    },
    Actor2KnownGroupCode: {
      type: String,
    },
    Actor2EthnicCode: {
      type: String,
    },
    Actor2Religion1Code: {
      type: String,
    },
    Actor2Religion2Code: {
      type: String,
    },
    Actor2Type1Code: {
      type: String,
    },
    Actor2Type2Code: {
      type: String,
    },
    Actor2Type3Code: {
      type: String,
    },
    IsRootEvent: {
      type: String,
    },
    EventCode: {
      type: String,
    },
    EventBaseCode: {
      type: String,
    },

    EventRootCode: {
      type: String,
    },

    QuadClass: {
      type: String,
    },

    GoldsteinScale: {
      type: String,
    },

    NumMentions: {
      type: String,
    },
    NumSources: {
      type: String,
    },

    NumArticles: {
      type: String,
    },

    AvgTone: {
      type: Number,
    },

    Actor1Geo_Type: {
      type: String,
    },

    Actor1Geo_FullName: {
      type: String,
    },

    Actor1Geo_CountryCode: {
      type: String,
    },

    Actor1Geo_ADM1Code: {
      type: String,
    },

    Actor1Geo_Lat: {
      type: String,
    },

    Actor1Geo_Long: {
      type: String,
    },

    Actor1Geo_FeatureID: {
      type: String,
    },

    Actor2Geo_Type: {
      type: String,
    },

    Actor2Geo_FullName: {
      type: String,
    },

    Actor2Geo_CountryCode: {
      type: String,
    },

    Actor2Geo_ADM1Code: {
      type: String,
    },

    Actor2Geo_Lat: {
      type: String,
    },

    Actor2Geo_Long: {
      type: String,
    },

    Actor2Geo_FeatureID: {
      type: String,
    },

    ActionGeo_Type: {
      type: String,
    },

    ActionGeo_FullName: {
      type: String,
    },

    ActionGeo_CountryCode: {
      type: String,
    },

    ActionGeo_ADM1Code: {
      type: String,
    },

    ActionGeo_Lat: {
      type: Number,
    },

    ActionGeo_Long: {
      type: Number,
    },

    ActionGeo_FeatureID: {
      type: String,
    },

    DATEADDED: {
      type: String,
    },

    SOURCEURL: {
      type: String,
    },
  },
  { collection: 'events' }
);

module.exports = {
  Master: mongoose.model('Master', masterSchema),
};
