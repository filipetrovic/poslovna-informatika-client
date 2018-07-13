<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <div class="backdropZoom" @click="zoomGrupaActivated = false" v-bind:class="{popupActive: zoomGrupaActivated}"></div>
    <div class="backdropZoom" @click="zoomJedinicaActivated = false" v-bind:class="{popupActive: zoomJedinicaActivated}"></div>
    <section class="welcome-message">
      <h1> Proizvod </h1>
    </section>

    <section class="main-content">
      <h1> Dodaj novi proizvod </h1>
      <form class="add-agent-form">
        <label>Naziv <span> * </span></label>
        <input type="text"  v-model="proizvod.nazivProizvoda" />
        <label>Vrsta <span> * </span></label>
        <input type="text"  v-model="proizvod.vrstaProizvoda" />
        <label>Grupa <span> * </span></label>
        <select   v-model="proizvod.grupaProizvoda">
          <option :value="g" v-for="g in listaGrupaProizvoda"> {{g.nazivGrupeProizvoda}}</option>

        </select><button type="button" class="zoomButton" @click="zoomGrupa()">...</button>

        <label>Jedinica mere <span> * </span></label>
        <select v-model="proizvod.jedinicaMere">
          <option :value="j" v-for="j in listaJedinicaMere"> {{j.nazivJediniceMere}}</option>
        </select><button type="button" class="zoomButton"  @click="zoomJedinica()">...</button>

        <button type="button" @click="addProizvod()" > Add </button>
      </form>


    </section>

    <section class="table"  >
      <h1> Prozvodi </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>
          <th> Vrsta </th>
          <th> Grupa</th>
          <th> Jedinica Mere</th>
          <th></th>
        </tr>
        <tr  class="table-row"  v-for="p in listaProizvoda" >
          <td>{{p.id}}</td>
          <td>{{p.nazivProizvoda}}</td>
          <td> {{p.vrstaProizvoda}}</td>
          <td> {{p.grupaProizvoda.nazivGrupeProizvoda}} </td>
          <td> {{p.jedinicaMere.nazivJediniceMere}}</td>
          <td class="operations">
            <span >
               <i class="material-icons" @click="updateProizvod(p)">
                edit
              </i>
            </span>
            <span >
              <i class="material-icons" @click="deleteProizvod(p.id)">
                delete
              </i>
            </span>
            <span >
              <i class="material-icons" @click="nextTo(p)">
                navigate_next
              </i>
            </span>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h4>
          Azuriraj proizvod
      </h4>
      <form class="form-popup" >
        <label >Naziv </label>
        <input type="text"  v-model.once="proizvodZaAzuriranje.nazivProizvoda">
        <label>Vrsta</label>
        <input type="text"  v-model="proizvodZaAzuriranje.vrstaProizvoda" />
        <label>Grupa <span> * </span></label>
        <select   v-model="proizvodZaAzuriranje.grupaProizvoda">
          <option :value="g" v-for="g in listaGrupaProizvoda"> {{g.nazivGrupeProizvoda}}</option>

        </select>

        <label>Jedinica mere <span> * </span></label>
        <select v-model="proizvodZaAzuriranje.jedinicaMere">
          <option :value="j" v-for="j in listaJedinicaMere"> {{j.nazivJediniceMere}}</option>
        </select>

        <button type="button" @click="popupActivated=false;confirmUpdateProizvod()" > Edit </button>
      </form>
      {{proizvodZaAzuriranje}}
      {{proizvod}}
    </section>

    <section class="popup" v-bind:class="{popupActive: zoomGrupaActivated}">
      <h1> Grupe proizvoda </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>
          <th> PDV</th>
        </tr>
        <tr  class="table-row" :class="{selected: proizvod.grupaProizvoda.nazivGrupeProizvoda === g.nazivGrupeProizvoda}" @click="setSelectedGrupa(g)" v-for="g in listaGrupaProizvoda" >
          <td>{{g.id}}</td>
          <td>{{g.nazivGrupeProizvoda}}</td>
          <td> {{g.pdv.naziv}}</td>
        </tr>
      </table>
    </section>

    <section class="popup" v-bind:class="{popupActive: zoomJedinicaActivated}">
      <h1> Jedinice mere </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>
          <th> Skracenica </th>
        </tr>
        <tr  class="table-row" :class="{selected: proizvod.jedinicaMere.nazivJediniceMere === j.nazivJediniceMere}" @click="setSelectedJedinica(j)"  v-for="j in listaJedinicaMere" >
          <td>{{j.id}}</td>
          <td>{{j.nazivJediniceMere}}</td>
          <td>{{j.skracenica}}</td>
        </tr>
      </table>
    </section>

  </main>
</template>

<script>

export default {
  data() {
    return {
      listaProizvoda : [],
      listaGrupaProizvoda : [],
      listaJedinicaMere : [],
      proizvod: {
        id: '',
        nazivProizvoda: '',
        vrstaProizvoda: '',
        grupaProizvoda: '',
        jedinicaMere: ''

      },
      proizvodZaAzuriranje: {
        id: '',
        nazivProizvoda: '',
        vrstaProizvoda: '',
        grupaProizvoda: '',
        jedinicaMere: ''

      },
      popupActivated: false,

      //ZOOOOOOOOOOOOOOOOOOOOOOOOOM
      zoomGrupaActivated : false,
      zoomJedinicaActivated : false,

    };
  },
  methods: {
    addProizvod(){

      this.$http.post('api/proizvod/add', this.proizvod).then(response => {
        this.$http.get("api/proizvod/getAll")
            .then(list => {
              this.listaProizvoda = list.body;

            })
      })
    },
    deleteProizvod(id){
      var params = { 'id' : id } ;

      this.$http.delete("api/proizvod/delete", {params: params}).then(response => {
        console.log(response)
        this.$http.get('api/proizvod/getAll').then(response => {
          this.listaProizvoda = response.body;
        })
      })
    },
    updateProizvod(p){
      var params = {'id' : p.id};
      this.$http.get('api/proizvod/getOne', {params: params}).then(response => {
      this.proizvodZaAzuriranje = response.body;
      })
      this.popupActivated = true;
    },
    confirmUpdateProizvod(){
       var body = this.proizvodZaAzuriranje;

        this.$http.put("api/proizvod/update", body )
        .then(response => {
            this.$http.get("api/proizvod/getAll")
            .then(list => {
              this.listaProizvoda = list.body;

            })
        },
        (err) => {
          alert('Doslo je do greske');

        })
    },
   zoomGrupa(){
     this.zoomGrupaActivated = true;
   },
   zoomJedinica(){
     this.zoomJedinicaActivated = true;
   },
   setSelectedGrupa(g){
     this.proizvod.grupaProizvoda = g;
     this.zoomGrupaActivated = false;
   },
   setSelectedJedinica(g){
     this.proizvod.jedinicaMere = g;
     this.zoomJedinicaActivated = false;
   },
   nextTo(p){
     this.$store.state.nextEntity = p;

     //console.log(JSON.parse(JSON.stringify(this.$store.state.selectedEntityForNext)))
     this.$router.push('/stavka');

   }
  },
  created() {
    this.$http.get('api/proizvod/getAll').then(response => {
      this.listaProizvoda = response.body;
    })
    this.$http.get('api/grupaProizvoda/getAll').then(response =>{
      this.listaGrupaProizvoda = response.body
    })
    this.$http.get('api/jedinicaMere/getAll').then(response =>{
      this.listaJedinicaMere = response.body
    })



  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables/vars.scss";
@import "../assets/scss/mixins/pageParts/_pageParts.scss";
@import "../assets/scss/mixins/buttons/_default.scss";
@import "../assets/scss/mixins/tables/_defaultTable.scss";
@import "../assets/scss/mixins/transitions/_itemTransition.scss";

.popup {
  display:none;
  background: $popup-window-color;
  border: 3px solid $default-color;
  padding: 1rem;
  border-radius: 20px;
  width: 55%;
  position: fixed;
  z-index: 6;
  top: 50%;
  left: 25%;

  h1 {
    color: $text-color;
    font-size: 2rem;
    text-shadow: 1px 1px 1px $text-color;
  }
  table {
    @include defaultTable;
    min-width: 700px;

    .selected {
      background: darken($default-color, 30%) !important;
      color: white !important;
    }
  }
}

.edit-popup {

    display: none;
    background: $popup-window-color;
    border: 3px solid $default-color;
    padding: 1rem;
    border-radius: 20px;
    width: 35%;
    position: fixed;
    z-index: 6;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 2px 2px gray;

      h4 {
        color: $text-color;
        text-align: center;
        font-size: 1.3rem;
        padding: 0;

        &:hover,
        &:active {
          color: $text-color;
          cursor:default;
        }
      }

      div {


        input {
          width: 15rem;
        }
        button {
          &:after {
            display: none;
          }
        }
      }
  }

.popupActive {
    display: block !important;
}
.backdrop {
    display: none;
    position:fixed;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background: transparentize($backdrop-color,0.7);
}

.backdropZoom {
  @extend .backdrop;
}

.welcome-message {
  @include welcomeMessage;
}

.main-content {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    color: $text-color;
    font-size: 2rem;
    text-shadow: 1px 1px 1px $text-color;
  }
  form {
    margin-bottom: 4rem;
    width: 50%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: 1rem;

    .zoomButton {
      width:30px;
      margin:0;
      padding: 0;
      height: 20px;
      justify-self: right;

      &:after{
        display: none;
      }
    }

    label {
      align-self: center;
      text-align: left;
      font-weight: bold;

      span {
        color: red;
      }
    }

    input {
      padding: 0.5rem 1rem;
      margin: 0.5rem 0;
      border: 2px solid lighten($default-color, 15%);
      border-radius: 6px;
      font-size: 1rem;

      &:focus {
        background: lighten($default-color, 40%);
      }
    }

    select {
      height: 40px;
      border: 2px solid lighten($default-color, 15%);
      border-radius: 6px;
    }

    button {
      @include defaultButton;
      width: 40%;
      justify-self: center;
      grid-column-start: 1;
      grid-column-end: span 2;
    }
  }

  .has-error {
    border: 2px solid $form-error-color;
    background: lighten($form-error-color, 15%) !important;
  }
}

.edit-popup {
    @extend .main-content;
    display: none;
    background: $popup-window-color;
    border: 3px solid $default-color;
    padding: 1rem;
    border-radius: 20px;
    width: 27%;
    position: fixed;
    z-index: 6;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 2px 2px gray;

      h4 {
        color: $text-color;
        text-align: center;
        font-size: 1.3rem;
        padding: 0;

        &:hover,
        &:active {
          color: $text-color;
          cursor:default;
        }
      }

      form {
        select {
          font-size: 1rem;
          padding-left: 0.8rem
        }

        input {
          width: 15rem;

        }
        button {
          &:after {
            display: none;
          }
        }
      }
  }

.table {
  margin-bottom: 4rem;
  h1 {
    color: $text-color;
    font-size: 2rem;
    text-shadow: 1px 1px 1px $text-color;
  }
  table {
    @include defaultTable;
    min-width: 700px;
  }
}
</style>
