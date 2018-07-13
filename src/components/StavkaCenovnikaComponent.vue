<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <div class="backdrop" @click="zoomProizvodActivated = false" v-bind:class="{popupActive: zoomProizvodActivated}"></div>
    <div class="backdrop" @click="zoomCenovnikActivated = false" v-bind:class="{popupActive: zoomCenovnikActivated}"></div>

    <section class="welcome-message">
      <h1> Stavke cenovnika </h1>
    </section>

    <section class="main-content">
      <h1> Dodaj novu stavku </h1>
      <form class="add-agent-form">
        <label>Cena <span> * </span></label>
        <input type="text"  v-model="stavka.cena" />

        <label>Proizvod <span> * </span></label>
        <select v-model="stavka.proizvod">
          <option :value="j" v-for="j in listaProizvoda"> {{j.nazivProizvoda}}</option>
        </select><button type="button" class="zoomButton" @click="zoomProizvod()">...</button>

        <label>Cenovnik <span> * </span></label>
        <select v-model="stavka.cenovnik">
          <option :value="j" v-for="j in listaCenovnika"> {{j.datumVazenja}}</option>
        </select><button type="button" class="zoomButton" @click="zoomCenovnik()">...</button>

        <button type="button" @click="addStavkaCenovnika()"> Add </button>
      </form>


    </section>

    <section class="table"  >
      <h1> Stavke </h1>
      <p v-if="nextExists" @click="clearFilter()"><b>Izbrisi filter (next) </b></p>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Cena </th>
          <th> Proizvod</th>
          <th> Cenovnik </th>


          <th></th>
        </tr>
        <tr  class="table-row"  v-for="s in listaStavki" >
          <td>{{s.id}}</td>
          <td>{{s.cena}}</td>
          <td> {{s.proizvod.nazivProizvoda}}</td>
          <td> {{s.cenovnik.datumVazenja}}</td>
          <td class="operations">
            <span >
               <i class="material-icons" @click="updateStavkaCenovnika(s)">
                edit
              </i>
            </span>
            <span >
              <i class="material-icons" @click="deleteStavkaCenovnika(s.id)">
                delete
              </i>
            </span>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h4>
          Azuriraj stavku cenovnika
      </h4>
      <form class="form-popup" >
        <label >Cena </label>
        <input type="text"  v-model.once="stavkaZaAzuriranje.cena">

        <label>Proizvod <span> * </span></label>
        <select v-model="stavkaZaAzuriranje.proizvod">
          <option :value="j" v-for="j in listaProizvoda"> {{j.nazivProizvoda}}</option>
        </select>

        <label>Cenovnik <span> * </span></label>
        <select v-model="stavkaZaAzuriranje.cenovnik">
          <option :value="j" v-for="j in listaCenovnika"> {{j.datumVazenja}}</option>
        </select>
        <button type="button" @click="popupActivated=false;confirmUpdateStavkaCenovnika()" > Edit </button>
      </form>
    </section>

    <section class="popup" v-bind:class="{popupActive: zoomProizvodActivated}">
      <h1> Prozvodi </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>
          <th> Vrsta </th>
        </tr>
        <tr  class="table-row" :class="{selected: stavka.proizvod.nazivProizvoda === p.nazivProizvoda}" @click="setSelectedProizvod(p)"  v-for="p in listaProizvoda" >
          <td>{{p.id}}</td>
          <td>{{p.nazivProizvoda}}</td>
          <td> {{p.vrstaProizvoda}}</td>


        </tr>
      </table>
    </section>

    <section class="popup" v-bind:class="{popupActive: zoomCenovnikActivated}">

      <h1> Cenovnici </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Datum vazenja </th>

          <th></th>
        </tr>
        <tr  class="table-row" :class="{selected: stavka.cenovnik.id === c.id}" @click="setSelectedCenovnik(c)"  v-for="c in listaCenovnika" >
          <td>{{c.id}}</td>
          <td>{{c.datumVazenja}}</td>
        </tr>
      </table>
    </section>

  </main>
</template>

<script>

export default {
  data() {
    return {
      listaStavki : [],
      listaCenovnika : [],
      listaProizvoda : [],
      nextExists: false,
      stavka: {
        id: '',
        cena: '',
        proizvod: '',
        cenovnik: ''

      },
      stavkaZaAzuriranje: {
        id: '',
        cena: '',
        proizvod: '',
        cenovnik: ''

      },
      popupActivated: false,

      zoomProizvodActivated: false,
      zoomCenovnikActivated: false
    };
  },
  methods: {
    addStavkaCenovnika(){

      this.$http.post('api/stavkaCenovnika/add', this.stavka).then(response => {
        this.$http.get("api/stavkaCenovnika/getAll")
            .then(list => {
              this.listaStavki = list.body;

            })
      })
    },
    deleteStavkaCenovnika(id){
      console.log("Udario")
      var params = { 'id' : id } ;

      this.$http.delete("api/stavkaCenovnika/delete", {params: params}).then(response => {
        console.log(response)
        this.$http.get('api/stavkaCenovnika/getAll').then(response => {
          this.listaStavki = response.body;
        })
      })
    },
    updateStavkaCenovnika(p){
      var params = {'id' : p.id};
      this.$http.get('api/stavkaCenovnika/getOne', {params: params}).then(response => {
        this.stavkaZaAzuriranje = response.body;
      })
      this.popupActivated = true;
    },
    confirmUpdateStavkaCenovnika(){
       var body = this.stavkaZaAzuriranje;

        this.$http.put("api/stavkaCenovnika/update", body )
        .then(response => {
            this.$http.get("api/stavkaCenovnika/getAll")
            .then(list => {
              this.listaStavki = list.body;

            })
        },
        (err) => {
          alert('Doslo je do greske');

        })
    },
    zoomProizvod() {
      this.zoomProizvodActivated = true;
    },
    zoomCenovnik(){
      this.zoomCenovnikActivated = true;
    },
    setSelectedProizvod(p){
      this.stavka.proizvod = p;
      this.zoomProizvodActivated = false;
    },
    setSelectedCenovnik(c){
      this.stavka.cenovnik = c;
      this.zoomCenovnikActivated = false;
    },
    clearFilter() {
      this.nextExists = false;
      this.$store.state.nextEntity = '';
      this.$http.get('api/stavkaCenovnika/getAll').then(response => {
      this.listaStavki = response.body;
    })
    }
  },
  created() {
    if (this.$store.state.nextEntity !== ''){
      this.nextExists = true;
    }
    if (this.nextExists){

      this.$http.get('api/stavkaCenovnika/getAll').then(response => {
        var lista = response.body;
        this.listaStavki = []
        for( var i = 0; i < lista.length; i++){
          if (lista[i].proizvod.id === this.$store.state.nextEntity.id){
            this.listaStavki.push(lista[i]);
          }
        }


    })
    } else {

      this.$http.get('api/stavkaCenovnika/getAll').then(response => {
      this.listaStavki = response.body;
    })
    }

    this.$http.get('api/cenovnik/getAll').then(response =>{
      this.listaCenovnika = response.body
    })
    this.$http.get('api/proizvod/getAll').then(response => {
      var lista = response.body;
      for (var i = 0; i < lista.length; i++) {

        var proizvod = {
          id: '',
          nazivProizvoda: '',
          vrstaProizvoda: ''
        }

        proizvod.id = lista[i].id
        proizvod.nazivProizvoda = lista[i].nazivProizvoda;
        proizvod.vrstaProizvoda = lista[i].vrstaProizvoda;

        this.listaProizvoda.push(proizvod);
      }

      console.log(JSON.parse(JSON.stringify(this.listaProizvoda)))
    })



  },
  beforeRouteLeave (to, from, next) {
    this.$store.state.nextEntity = '';
    next();

  },
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
  p {
    padding-left: 3rem;
    width: 150px;
    text-align: left;
    cursor: pointer;

    &:hover {
      color: black;
      text-shadow: 1px 1px 1px gray;
    }
  }
  table {
    @include defaultTable;
    min-width: 700px;
  }
}
</style>
