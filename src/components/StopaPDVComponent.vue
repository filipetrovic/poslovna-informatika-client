<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <div class="backdrop" @click="zoomActivated = false" v-bind:class="{popupActive: zoomActivated}"></div>

    <section class="welcome-message">
      <h1> Stope PDV-a </h1>
    </section>

    <section class="main-content">
      <h1> Dodaj novu stopu </h1>
      <form class="add-agent-form">
        <label>Stopa <span> * </span></label>
        <input type="text"  v-model="stopa.stopa" />

        <label>Datum vazenja <span> * </span></label>
        <input type="date" v-model="stopa.datumVazenja" />

        <label>PDV <span> * </span></label>
        <select v-model="stopa.pdv">
          <option :value="j" v-for="j in listaPDVa"> {{j.naziv}}</option>
        </select><button type="button" class="zoomButton" @click="zoomPDV()">...</button>

        <button type="button" @click="addStopaPDV()"> Add </button>
      </form>


    </section>

    <section class="table"  >
      <h1> Stope </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Stopa </th>
          <th> Datum vazenja</th>
          <th> PDV </th>


          <th></th>
        </tr>
        <tr  class="table-row"  v-for="s in listaStopa" >
          <td>{{s.id}}</td>
          <td>{{s.stopa}}</td>
          <td> {{s.datumVazenja}}</td>
          <td> {{s.pdv.naziv}}</td>
          <td class="operations">
            <span >
               <i class="material-icons" @click="updateStopaPDV(s)">
                edit
              </i>
            </span>
            <span >
              <i class="material-icons" @click="deleteStopaPDV(s.id)">
                delete
              </i>
            </span>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h4>
          Azuriraj stopu PDVa
      </h4>
      <form class="form-popup" >
        <label >Stopa </label>
        <input type="text"  v-model.once="stopaZaAzuriranje.stopa">

        <label>Datum vazenja <span> * </span></label>
        <input type="date" v-model="stopaZaAzuriranje.datumVazenja" />

        <label>PDV <span> * </span></label>
        <select v-model="stopaZaAzuriranje.pdv">
          <option :value="j" v-for="j in listaPDVa"> {{j.naziv}}</option>
        </select>



        <button type="button" @click="popupActivated=false;confirmUpdateStopaPDV()" > Edit </button>

      </form>
    </section>

    <section class="popup" v-bind:class="{popupActive: zoomActivated}">
      <h1> PDV-ovi </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>
        </tr>
        <tr  class="table-row" :class="{selected: stopa.pdv.id === p.id}" @click="setSelectedPDV(p)"  v-for="p in listaPDVa" >
          <td>{{p.id}}</td>
          <td>{{p.naziv}}</td>
          </td>
        </tr>
      </table>
    </section>
  <br><br>

  </main>
</template>

<script>

export default {
  data() {
    return {
      listaStopa : [],
      listaPDVa : [],


      stopa: {
        id: '',
        stopa: '',
        datumVazenja: '',
        pdv: ''

      },
      stopaZaAzuriranje: {
        id: '',
        stopa: '',
        datumVazenja: '',
        pdv: ''

      },
      popupActivated: false,
      zoomActivated: false
    };
  },
  methods: {
    addStopaPDV(){

      this.$http.post('api/stopa/add', this.stopa).then(response => {
        this.$http.get("api/stopa/getAll")
            .then(list => {
              this.listaStopa = list.body;

            })
      })
    },
    deleteStopaPDV(id){
      console.log("Udario")
      var params = { 'id' : id } ;

      this.$http.delete("api/stopa/delete", {params: params}).then(response => {
        console.log(response)
        this.$http.get('api/stopa/getAll').then(response => {
          this.listaStopa = response.body;
        })
      })
    },
    updateStopaPDV(p){
      var params = {'id' : p.id};
      this.$http.get('api/stopa/getOne', {params: params}).then(response => {
        this.stopaZaAzuriranje = response.body;
        var res = this.stopaZaAzuriranje.datumVazenja.split("T");
        this.stopaZaAzuriranje.datumVazenja = res[0];
        console.log(JSON.parse(JSON.stringify(this.stopaZaAzuriranje.pdv)))
      })
      this.popupActivated = true;
    },
    confirmUpdateStopaPDV(){
       var body = this.stopaZaAzuriranje;

        this.$http.put("api/stopa/update", body )
        .then(response => {
            this.$http.get("api/stopa/getAll")
            .then(list => {
              this.listaStopa = list.body;
              this.$http.get('api/pdv/getAll').then(response =>{
              this.listaPDVa = []
              var lista = response.body;
              for (var i = 0; i < lista.length; i++) {

                var pdv = {
                  id: '',
                  naziv: '',
                  stopa: []
                }

                pdv.id = lista[i].id
                pdv.naziv = lista[i].naziv;
                pdv.stopa = lista[i].stopa;

                this.listaPDVa.push(pdv);
              }
      console.log(JSON.parse(JSON.stringify(this.listaPDVa[2])))


    })
            })
        },
        (err) => {
          alert('Doslo je do greske');

        })
    },
    zoomPDV(){
      this.zoomActivated = true;
    },
    setSelectedPDV(p){
      this.stopa.pdv = p;
      this.zoomActivated = false;
    }
  },
  created() {
    this.$http.get('api/stopa/getAll').then(response => {
      this.listaStopa = response.body;
    })
    this.$http.get('api/pdv/getAll').then(response =>{
      var lista = response.body;
      for (var i = 0; i < lista.length; i++) {

        var pdv = {
          id: '',
          naziv: '',
          stopa: []
        }

        pdv.id = lista[i].id
        pdv.naziv = lista[i].naziv;
        pdv.stopa = lista[i].stopa;

        this.listaPDVa.push(pdv);
      }
      console.log(JSON.parse(JSON.stringify(this.listaPDVa[2])))


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
