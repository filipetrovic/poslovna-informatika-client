<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <section class="welcome-message">
      <h1> Jedinica Mere </h1>
    </section>

    <section class="main-content">
      <h1> Dodaj novu jedinicu mere </h1>
      <form class="add-agent-form">
        <label>Naziv <span> * </span></label>
        <input type="text"  v-model="jedinicaMere.nazivJediniceMere" />

        <label>Skracenica <span> * </span></label>
        <input type="text"  v-model="jedinicaMere.skracenica" />


        <button type="button" @click="addPDV()"> Add </button>
      </form>


    </section>

    <section class="table"  >
      <h1> Jedinice mere </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>
          <th> Skracenica </th>


          <th></th>
        </tr>
        <tr  class="table-row"  v-for="j in listaJedinica" >
          <td>{{j.id}}</td>
          <td>{{j.nazivJediniceMere}}</td>
          <td>{{j.skracenica}}</td>


          <td class="operations">
            <span >
               <i class="material-icons" @click="updatePDV(j)">
                edit
              </i>
            </span>
            <span >
              <i class="material-icons" @click="deletePDV(j.id)">
                delete
              </i>
            </span>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h4>
          Azuriraj Jedinicu mere
      </h4>
      <form class="form-popup" >
        <label >Naziv </label>
        <input type="text"  v-model.once="jedinicaMereZaAzuriranje.nazivJediniceMere">

        <label>Skracenica <span> * </span></label>
        <input type="text"  v-model="jedinicaMereZaAzuriranje.skracenica" />

        <button type="button" @click="popupActivated=false;confirmUpdatePDV()" > Edit </button>
      </form>
    </section>
  </main>
</template>

<script>

export default {
  data() {
    return {
      listaJedinica : [],
      jedinicaMere: {
        id: '',
        nazivJediniceMere: '',
        skracenica: ''

      },
      jedinicaMereZaAzuriranje: {
        id: '',
        nazivJediniceMere: '',
        skracenica: ''

      },
      popupActivated: false,
    };
  },
  methods: {
    addPDV(){

      this.$http.post('api/jedinicaMere/add', this.jedinicaMere).then(response => {
        this.$http.get("api/jedinicaMere/getAll")
            .then(list => {
              this.listaJedinica = list.body;

            })
      })
    },
    deletePDV(id){
      console.log("Udario")
      var params = { 'id' : id } ;

      this.$http.delete("api/jedinicaMere/delete", {params: params}).then(response => {
        console.log(response)
        this.$http.get('api/jedinicaMere/getAll').then(response => {
          this.listaJedinica = response.body;
        })
      })
    },
    updatePDV(p){
      var params = {'id' : p.id};
      this.$http.get('api/jedinicaMere/getOne', {params: params}).then(response => {
        this.jedinicaMereZaAzuriranje = response.body;
      })
      this.popupActivated = true;
    },
    confirmUpdatePDV(){
       var body = this.jedinicaMereZaAzuriranje;

        this.$http.put("api/jedinicaMere/update", body )
        .then(response => {
            this.$http.get("api/jedinicaMere/getAll")
            .then(list => {
              this.listaJedinica = list.body;

            })
        },
        (err) => {
          alert('Doslo je do greske');

        })
    }
  },
  created() {
    this.$http.get('api/jedinicaMere/getAll').then(response => {
      this.listaJedinica = response.body;
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
  }
}
</style>
