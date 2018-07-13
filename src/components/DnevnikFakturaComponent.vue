<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <section class="welcome-message">
      <h1> Prikaz dnevnika izlaznih faktura </h1>
    </section>

    <section class="main-content">
      <h1> Vremenski interval </h1>
      <form class="add-agent-form">
        <label>Od <span> * </span></label>
        <input type="date" v-model="od" />

        <label>Do <span> * </span></label>
        <input type="date" v-model="doDatum" />

        <button type="button" @click="getFakture()"> Napravi izvestaj </button>

      </form>


    </section>

     <section class="table"  >
      <h1> Lista faktura </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Poslovna godina </th>
          <th> Broj fakture </th>
          <th> Datum </th>
          <th> Rabat </th>
          <th> Osnovica </th>
          <th> PDV </th>
          <th ><b> Ukupno</b> </th>
          <th></th>
        </tr>
        <tr  class="table-row"  v-for="f in listaFaktura" >
          <td @click="showStavke(f)"> {{f.id}} </td>
          <td @click="showStavke(f)"> {{f.poslovnaGodina.godina}} </td>
          <td @click="showStavke(f)"> {{f.brojFakture}} </td>
          <td @click="showStavke(f)"> {{f.datumFakture}} </td>
          <td @click="showStavke(f)"> {{f.ukupanRabat}} </td>
          <td @click="showStavke(f)"> {{f.ukupanIznosBezPDV}} </td>
          <td @click="showStavke(f)"> {{f.ukupanPDV}}</td>
          <td @click="showStavke(f)"><b> {{f.ukupnoZaPlacanje}}</b> </td>
          <td class="operations">
            <span >
              <i class="material-icons" @click="exportuj(f)">
                forward
              </i>
            </span>

          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h1> Stavke fakture </h1>
      <table>
        <tr class="header-row">

          <th> Proizvod </th>
          <th> Kolicina </th>
          <th> Jedinicna cena </th>
          <th> StopaPDVa </th>
          <th> Osnovica </th>
          <th> UkupanPDV </th>
          <th> Ukupan iznos </th>

        </tr>
        <tr class="table-row"  v-for="s in selectedFaktura.stavkeFakture" >
          <td>{{s.proizvod.nazivProizvoda}}</td>
          <td>{{s.kolicina}}</td>
          <td>{{s.jedinicnaCena}}</td>
          <td>{{s.stopaPDV}}</td>
          <td>{{s.osnovica}}</td>
          <td>{{s.iznosPDV}}</td>
          <td>{{s.ukupanIznos}}</td>
        </tr>
      </table>
    </section>

  </main>
</template>

<script>

export default {
  data() {
    return {

      od : '',
      doDatum: '',
      listaFaktura : [],
      selectedFaktura: '',
      popupActivated: false,

    };
  },
  methods: {
    getFakture() {
      var params = {
        'datumOd' : this.od,
        'datumDo' : this.doDatum
      }

      this.$http.get('api/faktura/getKif',{params:params}).then(response => {
        this.listaFaktura = response.body;
      })
    },
    showStavke(n) {
      var params = {'id' : n.id};
      this.$http.get('api/faktura/getOne', {params: params}).then(response => {
        this.selectedFaktura = response.body;
      })
      this.popupActivated = true;
    },
  },
  created() {



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

    display:none;
  background: $popup-window-color;
  border: 3px solid $default-color;
  padding: 1rem;
  border-radius: 20px;
  width: 75%;
  position: fixed;
  z-index: 6;
  top: 50%;
  left: 10%;

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
