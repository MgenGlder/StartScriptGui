<template>
    <div id="app-wrapper">
        <!--<span>Active Services: {{activeServices}}</span>-->
        <div id="front-end-wrapper">
            <button @click="getHealthStatus">Get Statuses</button>
            <!--<span>{{allServicesStatus}}</span>-->
            <!--<div @click="grabAllRunningPorts">Grab all ports</div>-->
            <div @click="someFunction">Nikhil's Hook</div>
            <div class="section-header">
                <span>Front end</span>
            </div>
            <div class="section-option">
                <!-- <CheckboxSlider @input="checkInput" v-model="uiState" @input-click="runBashScript" /> -->
                <CheckboxSlider v-model="ui.toggled"/>
                <span>Run UI</span>
                <loading-spinner v-if="ui.toggled"/>
            </div>
            <div class="section-option">
                <CheckboxSlider/>
                <span>Run Styleguide</span>
            </div>
        </div>
        <div id="back-end-wrapper">
            <div class="section-header">Back End</div>

            <div class="section-option">
                <!--<input type="checkbox" value="au-telematics" v-model="allServicesStatus"/>-->
                <CheckboxSlider @click="toggleService" name="au-telematics" v-model="allServicesStatus" model=""/>
                <span>Run Au Telematics</span>
            </div>
            <div class="section-option">
                <CheckboxSlider name="health" v-model="allServicesStatus"/>
                <span>Run Health</span>
            </div>
            <div class="section-option">
                <CheckboxSlider name="telematics" v-model="allServicesStatus"/>
                <span>Run Telematics</span>
            </div>
            <div class="section-option">
                <CheckboxSlider name="auth" v-model="allServicesStatus"/>
                <span>Run Auth</span>
            </div>
            <div class="section-option">
                <CheckboxSlider name="management" v-model="allServicesStatus"/>
                <span>Run Management</span>
            </div>
            <div class="disabled-section-option">
                <CheckboxSlider name="vehicle-enrollment" v-model="allServicesStatus"/>
                <span>Vehicle Enrollment</span>
            </div>
        </div>
        <div id="external-wrapper">
            <div class="section-header">External</div>
            <div class="section-option">
                <CheckboxSlider/>
                <span>Redis</span>
            </div>
            <div class="section-option">
                <CheckboxSlider/>
                <span>Mongo</span>
            </div>
            <div class="section-option">
                <CheckboxSlider/>
                <span>SQLS</span>
            </div>
        </div>
    </div>
</template>


<script>
  import { mapState, mapActions } from 'vuex';
  import CheckboxSlider from './CheckboxSlider';
  import LoadingSpinner from './LoadingSpinner';

  export default {
    name: 'Dashboard',
    components: {
      CheckboxSlider,
      LoadingSpinner,
    },
    methods: {
      grabAllRunningPorts() {
        this.$electron.ipcRenderer.send('allRunningServices');
      },
      getHealthStatus() {
        // this.$store.commit('Services/UPDATE_ACTIVE_SERVICES', 'poop');
        console.log('Running getHealthStaus call');
        this.$electron.ipcRenderer.send('getHealthStatus');
      },
      runBashScript() {
        this.$electron.ipcRenderer.send('pinger', 'PING!!!!');
      },
      someFunction() {
        this.$electron.ipcRenderer.send('pinger');
      },
      toggleService() {
        console.log('clicked');
      },
      ...mapActions('Services', ['setActiveServices']),
    },
    data() {
      return {
        ui: {
          toggled: false,
          up: false,
        },
        allServicesStatus: [],
      };
    },
    computed: {
      ...mapState('Services', ['activeServices']),
    },
    mounted() {
      // this.$electron.ipcRenderer.send('allRunningServices');
      // this.$electron.ipcRenderer.on('allRunningServicesResponse', (event, message) => {
      //   console.log(message);
      // });
      this.$electron.ipcRenderer.on('getHealthStatusResponse', (event, message) => {
        this.allServicesStatus = message;

        console.log(message);
      });
    },
  };
</script>

<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkid-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: #2196f3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
        background-color: lightgreen;
    }

    .disabled-section-option {
        text-decoration: line-through;
    }

    .section-header {
    }

    .service-option {
    }

    #front-end-wrapper {
        width: 20%;
        text-align: left;
    }

    #back-end-wrapper {
        text-align: left;
    }

    #external-wrapper {
        text-align: left;
    }

    .on-toggle {
        margin-right: 10px;
        display: inline-block;
    }

    #app-wrapper {
        display: flex;
        justify-content: space-between;
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
