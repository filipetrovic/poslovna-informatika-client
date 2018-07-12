<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <section class="welcome-message">
      <h1> Cenovnici </h1>
    </section>

    <section class="main-content">
      <h1> Dodaj novi cenovnik </h1>
      <form class="add-agent-form">
        <label>Datum vazenja <span> * </span></label>
        <input type="date" v-model="cenovnik.datumVazenja" />

        <button type="button" @click="addCenovnik()"> Add </button>

      </form>


    </section>

    <section class="table"  >
      <h1> Cenovnici </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Datum vazenja </th>

          <th></th>
        </tr>
        <tr  class="table-row"  v-for="c in listaCenovnika" >
          <td>{{c.id}}</td>
          <td>{{c.datumVazenja}}</td>
          <td class="operations">
            <span >
               <i class="material-icons" @click="updateCenovnik(c)">
                edit
              </i>
            </span>
            <span >
              <i class="material-icons" @click="deleteCenovnik(c.id)">
                delete
              </i>
            </span>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h4>
          Azuriraj cenovnik
      </h4>
      <form class="form-popup" >
        <label>Datum vazenja <span> * </span></label>
        <input type="date" v-model="cenovnikZaAzuriranje.datumVazenja" />
        <button type="button" @click="popupActivated=false;confirmUpdateCenovnik()" > Edit </button>
      </form>
    </section>

  </main>
</template>

<script>

export default {
  data() {
    return {

      listaCenovnika : [],
      cenovnik: {
        id: '',
        datumVazenja: ''
      },
      cenovnikZaAzuriranje: {
        id: '',
        datumVazenja: ''
      },
      popupActivated: false,
    };
  },
  methods: {
    addCenovnik(){

      this.$http.post('api/cenovnik/add', this.cenovnik).then(response => {
        this.$http.get("api/cenovnik/getAll")
            .then(list => {
              this.listaCenovnika = list.body;

            })
      })
    },
    deleteCenovnik(id){
      console.log("Udario")
      var params = { 'id' : id } ;

      this.$http.delete("api/cenovnik/delete", {params: params}).then(response => {
        console.log(response)
        this.$http.get('api/cenovnik/getAll').then(response => {
          this.listaCenovnika = response.body;
        })
      })
    },
    updateCenovnik(p){
      var params = {'id' : p.id};
      this.$http.get('api/cenovnik/getOne', {params: params}).then(response => {
        this.cenovnikZaAzuriranje = response.body;
        var res = this.cenovnikZaAzuriranje.datumVazenja.split("T");
        this.cenovnikZaAzuriranje.datumVazenja = res[0];
      })
      this.popupActivated = true;
    },
    confirmUpdateCenovnik(){
       var body = this.cenovnikZaAzuriranje;

        this.$http.put("api/cenovnik/update", body )
        .then(response => {
            this.$http.get("api/cenovnik/getAll")
            .then(list => {
              this.listaCenovnika = list.body;

            })
        },
        (err) => {
          alert('Doslo je do greske');

        })
    }
  },
  created() {
    this.$http.get('api/cenovnik/getAll').then(response => {
      this.listaCenovnika = response.body;
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
