<template>
  <v-container >
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-row>
          <h1 v-if="!noResultsFound && typeof this.cityData.name !== 'undefined'">
            Weather For {{this.cityData.name}}
          </h1>
          <h1 v-else>
            Please type in a Zip Code or City name
          </h1>
        </v-row>
      </v-flex>
      <v-flex xs12>
        <v-row>
          <v-flex xs8 sm4>
            <v-text-field
              label="Search Area"
              v-model="locationSearch"
              required 
            ></v-text-field>
          </v-flex>
          <v-flex xs3 sm2 ml-2>
            <v-text-field
              label="Country(eg US,DE)"
              v-model="country"
              required 
            ></v-text-field>
          </v-flex>
          <v-flex xs4 sm2 ml-4>
            <v-switch v-model="useMetricTemp" label="°C"></v-switch>
          </v-flex>
          <v-flex xs7 sm3>
            <v-btn @click="geoLocateUser()">
              Your Location
            </v-btn> 
          </v-flex>
        </v-row>
        <v-row>
          <template v-if="!noResultsFound">
            <v-expansion-panels focusable>
               <v-expansion-panel
                v-for="day in desiredWeatherData"
              >
                <v-expansion-panel-header>
                  Date: {{day.details.date}} - {{day.details.day_friendly}}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table fixed-header dense text-left height="175px">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-center">Time</th>
                          <th class="text-center">Temp</th>
                          <th class="text-center">Temp Min</th>
                          <th class="text-center">Temp Max</th>
                          <th class="text-center">Presure</th>
                          <th class="text-center">Humidity</th>
                          <th class="text-left">Wind(m/s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="ea in day.items">
                          <td>{{ ea.time }}</td>
                          <td>
                            <span v-if="!useMetricTemp">
                              {{ ea.tempC.f }}
                            </span>
                            <span v-else>
                              {{ ea.tempC.c }}
                            </span>
                          </td>
                          <td>
                            <span v-if="!useMetricTemp">
                              {{ ea.tempMaxC.f }}
                            </span>
                            <span v-else>
                              {{ ea.tempMaxC.c }}
                            </span>
                          </td>
                          <td>
                            <span v-if="!useMetricTemp">
                              {{ ea.tempMinC.f }}
                            </span>
                            <span v-else>
                              {{ ea.tempMinC.c }}
                            </span>
                          </td>
                          <td>{{ ea.pressure }}hpa</td>
                          <td>{{ ea.humidity }}%</td>
                          <td class="text-left">{{ ea.wind.direction }} {{ ea.wind.speed }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <v-flex xs12>
            <v-alert
              v-model="noResultsFound" 
              type="warning" 
              color="warning" 
              text-color="white"
            >
              No results Found Please try another City, Zip Code, or check the spelling.
            </v-alert>
          </v-flex>       
        </v-row>
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="loadingWeatherData" 
      :top="true" 
      type="info"
    >
      Weather Data is loading
      <v-btn
        color="pink"
        text
        @click="loadingWeatherData = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>

export default({
  data() {
      return {
        loadingWeatherData:true,
        noResultsFound:true,
        locationSearch:'fun stuff',
        country:'us',
        desiredWeatherData: [],
        geolocationData: [],
        cityData: {},
        useMetricTemp:false,
      }
  },
  methods: {
    kelvinToFerenheight: function(kTemp) {
      if(kTemp){
        return parseInt(((kTemp - 273.15) * 9/5) + 32) + '°F';
      }
    },
    kelvinToCelcious: function(kTemp) {
      if(kTemp){
        return parseInt(kTemp - 273.15) + '°C';
      }
    },
    convertTemperatures: function(kTemp) {
      let temps = {};
      if(kTemp){
        temps['c'] = this.kelvinToCelcious(kTemp);
        temps['f'] = this.kelvinToFerenheight(kTemp);
      }
      return temps;
    },
    time_convert: function(num)  {
      var hours = Math.floor(num / 60);  
      var minutes = num % 60;
      return hours + ":" + minutes;         
    },
    convert24to12Hour: function(time) {
      let time12hrFormat = '';
      if(time){
        let timeArr = time.split(":");
        let hour = timeArr[0];
        let mins = timeArr[1];
        time12hrFormat = hour+' am';
        if(hour == 0 && mins == 0){
          time12hrFormat = '12 am';
        }else if(hour < 10){
          time12hrFormat = (hour+'').slice(1,2)+' am';
        }else if(hour > 12){
          hour = hour - 12;
          time12hrFormat = hour+' pm';
        }
      }
      return time12hrFormat;
    },
     degToCompass: function(num) {
      var val = Math.floor((num / 22.5) + 0.5);
      var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      return arr[(val % 16)];
    },
    dayOfTheWeek: function(dayNum) {
      let daysArr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      if(dayNum > -1){
        return daysArr[dayNum];
      }
    },
    processForcastData:function(wData) {
      let organizedData = [];
      let _this = this;
      this.cityData = wData.data.city;
      _this.desiredWeatherData = {};
      //end 
      if(wData && wData.data.list.length > 0){
        $.each(wData.data.list, function(k,i){
          let dateObj = new Date(i.dt_txt);
          let dayNum = dateObj.getDay();
          let dateArr = (i.dt_txt).split(" ");
          let date = dateArr[0];
          let time = dateArr[1];
          if(!_this.desiredWeatherData[date]) {
            _this.desiredWeatherData[date] = [];
            _this.desiredWeatherData[date]['details'] = {
              'date':date,
              'day_friendly':_this.dayOfTheWeek(dayNum),
            };
            _this.desiredWeatherData[date]['items'] = [];
          }
          let mainArr = i.main;
          mainArr['tempC'] = _this.convertTemperatures(mainArr.temp);
          mainArr['tempMaxC'] = _this.convertTemperatures(mainArr.temp_max);;
          mainArr['tempMinC'] = _this.convertTemperatures(mainArr.temp_min);;
          mainArr['time'] = _this.convert24to12Hour(time);
          mainArr['date'] = date;
          mainArr['weather'] = i.weather;
          mainArr['wind'] = i.wind;
          //Get Wind Direction:
          mainArr['wind']['direction'] = _this.degToCompass(i.wind.deg);
          mainArr['clouds'] = i.clouds;

          (_this.desiredWeatherData[date]['items']).push(mainArr);
        });
      }
      return _this.desiredWeatherData;
    },
    weatherData: function() {
      const _this = this;
      if(this.locationSearch){
        this.loadingWeatherData = true;
        let queryStr = '?';
        let searchTerm = '';
        //Basic validation - not addressing Canadian zips or other country versions of that ~ just weeds out US Zips or a string search term:
        searchTerm = this.locationSearch;
        if(isNaN(this.locationSearch)){
          //City Name:
          searchTerm = encodeURIComponent(searchTerm);
          queryStr += 'q='+searchTerm;
        }else if(this.locationSearch.length == 5){
          queryStr += 'zip='+searchTerm;
        }
        queryStr += ','+this.country;//Impplied US only
        axios.get('https://api.openweathermap.org/data/2.5/forecast'+queryStr+'&APPID=dc4cec467c746a747185b474a1eb32ec')
          .then(response => {
            _this.processForcastData(response);
            _this.noResultsFound = false;
            _this.loadingWeatherData = false;
          })
          .catch(error => {
            _this.noResultsFound = true;
            _this.loadingWeatherData = false;
            _this.desiredWeatherData = error;
            return ['error in getting data'];
          });
      }
    },
    useLatLongForAddress: function(geoData) {
      if(geoData && geoData.lat && geoData.lng){
        axios.get('https://api.opencagedata.com/geocode/v1/json?key=6cc825876fd84f9494dd16177e88b73e&q='+geoData.lat+'+'+geoData.lng+'&pretty=1&no_annotations=1')
        .then(response => {
          this.geolocationData['opencagedata'] = response;
          let addressData = this.geolocationData.opencagedata.data.results[0].components ? this.geolocationData.opencagedata.data.results[0].components : {};
          if(addressData.city && addressData.country_code){
            //populate initial field and trigger change:
            this.locationSearch = ''+addressData.city;
            this.country = ''+addressData.country_code;
          }
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
    geoLocateUser: function() {
      //API to use lat + long to get city, country:
      //https://api.opencagedata.com/geocode/v1/json?key=6cc825876fd84f9494dd16177e88b73e&q=LAT+LONG&pretty=1&no_annotations=1
      //Get Initial Permission and LAT + LONG of user:
      // vi.$getLocation()
      this.$getLocation()
      .then(coordinates => {
        this.geolocationData = coordinates;
        this.useLatLongForAddress(this.geolocationData);
      }).catch(error => {
        console.log('error',error);
      });
    }
  },
  watch:{
    locationSearch: function(val) {
      if(val.length > 0){
        this.weatherData();
      }
    },
    country: function() {
      if(this.locationSearch.length > 0 && this.country.length > 0){
        this.weatherData();
      }
    }
  },
  computed: {
    //
  },
  mounted: () => {

  }
})

</script>
