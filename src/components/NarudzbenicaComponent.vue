<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <section class="welcome-message">
      <h1> Lista narudzbenica </h1>
    </section>


    <section class="table"  >
      <h1> Narudzbenice </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Poslovni partner </th>

          <th></th>
        </tr>
        <tr  class="table-row"  v-for="n in listaNarudzbenica" >
          <td @click="showStavke(n)">{{n.id}}</td>
          <td @click="showStavke(n)">{{n.poslovniPartner.nazivPoslovnogPartnera}}</td>
          <td class="operations">
            <span >
              <i class="material-icons" @click="deleteNarudzbenica(n)">
                delete
              </i>
            </span>
            <button @click="fakturisi(n)"> Fakturisi</button>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup " v-bind:class="{popupActive: popupActivated}">
      <h4>
          Stavke narudzbenice #{{selectedNarudzbenica.id}}
      </h4>
      <table class="tabela">
        <tr class="header-row">
          <th> Proizvod </th>
          <th> Kolicina </th>


        </tr>
        <tr  class="table-row"  v-for="n in selectedNarudzbenicaStavke" >
          <td > {{n.proizvod.nazivProizvoda}}</td>
          <td > <b> {{n.kolicina}}</b> </td>
        </tr>
      </table>
    </section>

  </main>
</template>

<script>

export default {
  data() {
    return {
      listaNarudzbenica : [],
      listaProizvoda: [],
      selectedNarudzbenica : '',
      selectedNarudzbenicaStavke: [],
      popupActivated: false
    };
  },
  methods: {
    fakturisi() {
      alert("FAK");
    },
    showStavke(n) {
      var params = {'id' : n.id};
      this.$http.get('api/narudzbenica/getOne', {params: params}).then(response => {
        this.selectedNarudzbenica = response.body;
        this.selectedNarudzbenicaStavke = [];
        var stavka = {
            proizvod: '',
            kolicina: ''
          }
        for (var i = 0; i < this.selectedNarudzbenica.listaStavki.length; i++){
          var obj = this.selectedNarudzbenica.listaStavki[i];
          var stavka = {
            proizvod: '',
            kolicina: ''
          }
          stavka.proizvod =  this.listaProizvoda.find(function (a) { return a.id === obj.id; })
          stavka.kolicina = this.selectedNarudzbenica.listaStavki[i].kolicina;
          this.selectedNarudzbenicaStavke.push(stavka);
        }
      })
      this.popupActivated = true;
    },
    fakturisi(n){

      this.$http.post('api/faktura/add',n).then(response => {
        console.log(response.body);
        this.$router.push('/faktura');
      })
    },
    deleteNarudzbenica(n){
      var params = {
        'id': n.id
      }
      this.$http.delete('api/narudzbenica/delete', {params,params}).then(response=> {
        console.log(response.body);
        this.$http.get('api/narudzbenica/getAll').then(response => {
        this.listaNarudzbenica = response.body;

    })
      })
    }
  },
  created() {
    this.$http.get('api/narudzbenica/getAll').then(response => {
      this.listaNarudzbenica = response.body;

    })
    this.$http.get('api/proizvod/getAll').then(response => {
      this.listaProizvoda = response.body;

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

.edit-popup {

    display: none;
    background: $popup-window-color;
    border: 3px solid $default-color;
    padding: 1rem;
    border-radius: 20px;
    width: 65%;
    position: fixed;
    z-index: 6;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 2px 2px gray;

      .tabela{

          @include defaultTable;
          min-width: 200px;
          td:nth-of-type(1){
            width: 80%;
          }

          td:nth-of-type(2){
            width: 50px;
          }

          .operations {
            button {
              @include defaultButton;
              width: 50%;
            }
          }

      }

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

    tr {
      th:nth-of-type(3){
        width: 200px;
      }
    }

    .operations {
      justify-content: right !important;
      align-items:center;
      button {
        @include defaultButton;
        width: 40%;
        margin-right: 2rem;
      }

      span {
        i {
          color: $default-color;
          font-size: 2.5rem;
          margin: 0 1rem;
        }
      }
    }
  }
}
</style>
