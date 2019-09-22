<template>
  	<v-container >
  		<v-flex xs-12>
  			<v-row>
		  		<h1>About This Weather App</h1>
  			</v-row>
  			<v-row>
  				<ul>
	  				<li v-for="det in details" class="text-left">
						<strong>{{det.title}}</strong><br />
  						{{det.desc}}<br />
	  					<a v-if="det.link" v-bind:href="det.link">{{det.link}}</a>
	  				</li>
	  			</ul>
  			</v-row>
  		</v-flex>
	</v-container>
</template>

<script>

export default({
  data() {
      return {
        details: [
        	{
        		title:'Using Vue + Vuetify',
        		desc: 'Offers a wide array of options for premade templates for most things a website/app would need but also plenty of room to customize as needed or creat new ones. This Particular case I am using a CLI version of Vue that is compiling SCSS upon transpiling. See the link below for more information on this awesome framework.',
        		link: 'https://vuetifyjs.com/en/'
        	},
        	{
        		title:'Open Weather API',
        		desc: 'This API is very cool and offers alot if ya pay for it - but the free version is still very informative. ',
        		link: 'https://openweathermap.org/'
        	},
        	{
        		title:'Geo Location Feature',
        		desc: 'Using browser location details and a third party app to use LAT and LONG details to get exact details of the persons locations I was able to use the button on the app to triangulate the users location and get the city name and country from that which then get the Open Weather API data.',
        		link: 'https://opencagedata.com/'
        	},
        ]
      }
  }
});
</script>