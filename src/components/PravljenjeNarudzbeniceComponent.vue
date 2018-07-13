<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <section class="welcome-message">
      <h1> Kreiranje narudzbenice </h1>
    </section>

    <section class="table"  >
      <h1> Izaberite kolicinu proizvoda za narudzbinu </h1>
      <table>
        <tr class="header-row">
          <th> Grupa</th>
          <th> Naziv </th>
          <th> Kolicina</th>
        </tr>
        <tr  class="table-row"  v-for="p in listaProizvoda" >

          <td> {{p.grupaProizvoda.nazivGrupeProizvoda}} </td>
          <td>{{p.nazivProizvoda}}</td>

          <td class="operations">
               <input type="text"  placeholder="0" v-model="p.kolicina"/>
          </td>
        </tr>
      </table>

      <div id="partner">
        <label>Izaberite poslovnog partnera </label>
        <select   v-model="narudzbenica.poslovniPartner">
          <option :value="g" v-for="g in listaPartnera"> {{g.nazivPoslovnogPartnera}}</option>
        </select>

        <button @click="praviNarudzbenicu()"> Napravi narudzbenicu  </button>
      </div>


    </section>




  </main>
</template>

<script>

export default {
  data() {
    return {
      listaProizvoda : [],
      listaPartnera: [],
      narudzbenica: {
        listaStavki: [],
        poslovniPartner: ''
      },
      popupActivated: false,
    };
  },
  methods: {
    praviNarudzbenicu() {
      var listaStavkiNarudzbenice=[];
      for(var i = 0; i< this.listaProizvoda.length; i++){
        var stavka = {
          id: '',
          kolicina: ''
        }
        stavka.id = this.listaProizvoda[i].id;
        if(this.listaProizvoda[i].kolicina === ''){
          stavka.kolicina = 0;
        } else {
          stavka.kolicina = this.listaProizvoda[i].kolicina;
        }

        listaStavkiNarudzbenice.push(stavka);
      }
      console.log(JSON.parse(JSON.stringify(listaStavkiNarudzbenice)))

      var narudzbenica = {
        listaStavki: [],
        poslovniPartner: ''
      }

      narudzbenica.listaStavki = listaStavkiNarudzbenice;
      narudzbenica.poslovniPartner = this.narudzbenica.poslovniPartner;

      console.log(JSON.parse(JSON.stringify(narudzbenica)))

      this.$http.post('api/narudzbenica/add', narudzbenica).then(response => {
        console.log(response.body)
        this.$router.push('/narudzbenica');
      })




    }
  },
  created() {
    this.$http.get('api/proizvod/getAll').then(response => {

      this.listaProizvoda = response.body;
      for (var i = 0; i < this.listaProizvoda.length; i++){
        this.listaProizvoda[i].kolicina = 0;
      }
    })
    this.$http.get('api/poslovniPartner/getAll').then(response =>{
      this.listaPartnera = response.body
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

#partner {
  padding-left: 3rem;
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;

  label {
    font-size: 1.2rem;
    text-align: left;
    margin: 1rem;
    margin-left: 0;
  }
  select {
    width: 50%;
    height: 40px;
    border: 2px solid $default-color;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

  button {
    @include defaultButton;
    width: 300px;
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


    th:last-of-type{
      width: 100px;
    }

    .operations {
      justify-content: right !important;
      align-items: right !important;

        input {
          padding-left: 0.4rem;
          border: 2px solid $default-color;
          border-radius: 10px;
          font-size: 1.5rem;
          width :70px;
        }

    }
  }
}
</style>

