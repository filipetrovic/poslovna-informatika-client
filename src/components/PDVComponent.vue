<template>
  <main>
    <div class="backdrop" @click="popupActivated = false" v-bind:class="{popupActive: popupActivated}"></div>
    <section class="welcome-message">
      <h1> PDV </h1>
    </section>

    <section class="main-content">
      <h1> Dodaj novi PDV </h1>
      <form class="add-agent-form">
        <label>Naziv <span> * </span></label>
        <input type="text"  v-model="pdv.naziv" />

        <button type="button" @click="addPDV()"> Add </button>
      </form>


    </section>

    <section class="table"  >
      <h1> PDV-ovi </h1>
      <table>
        <tr class="header-row">
          <th> ID </th>
          <th> Naziv </th>



          <th> StopaPDV
            <i class="material-icons" @click="nextTo(p,1)">
                navigate_next
            </i>  / GrupaProizvoda
            <i class="material-icons" @click="nextTo(p,2)">
                next_week
            </i>
            </th>
        </tr>
        <tr  class="table-row"  v-for="p in listaPDVa" >
          <td>{{p.id}}</td>
          <td>{{p.naziv}}</td>


          <td class="operations">
            <span >
               <i class="material-icons" @click="updatePDV(p)">
                edit
              </i>
            </span>
            <span >
              <i class="material-icons" @click="deletePDV(p.id)">
                delete
              </i>
            </span>
            <span >
              <i class="material-icons" @click="nextTo(p,1)">
                navigate_next
              </i>
            </span>
            <span >
              <i class="material-icons" @click="nextTo(p,2)">
                next_week
              </i>
            </span>
          </td>
        </tr>
      </table>
    </section>

    <section class="edit-popup" v-bind:class="{popupActive: popupActivated}">
      <h4>
          Azuriraj PDV
      </h4>
      <form class="form-popup" >
        <label >Naziv </label>
        <input type="text"  v-model.once="pdvZaAzuriranje.naziv">

        <button type="button" @click="popupActivated=false;confirmUpdatePDV()" > Edit </button>
      </form>
    </section>
  </main>
</template>

<script>

export default {
  data() {
    return {
      listaPDVa : [],
      pdv: {
        id: '',
        naziv: '',
        stopa: []

      },
      pdvZaAzuriranje: {
        id: '',
        naziv: '',
        stopa: []

      },
      popupActivated: false,
    };
  },
  methods: {
    addPDV(){

      this.$http.post('api/pdv/add', this.pdv).then(response => {
        this.$http.get("api/pdv/getAll")
            .then(list => {
              this.listaPDVa = list.body;

            })
      })
    },
    deletePDV(id){
      console.log("Udario")
      var params = { 'id' : id } ;

      this.$http.delete("api/pdv/delete", {params: params}).then(response => {
        console.log(response)
        this.$http.get('api/pdv/getAll').then(response => {
          this.listaPDVa = response.body;
        })
      })
    },
    updatePDV(p){
      var params = {'id' : p.id};
      this.$http.get('api/pdv/getOne', {params: params}).then(response => {
        this.pdvZaAzuriranje = response.body;
      })
      this.popupActivated = true;
    },
    confirmUpdatePDV(){
       var body = this.pdvZaAzuriranje;

        this.$http.put("api/pdv/update", body )
        .then(response => {
            this.$http.get("api/pdv/getAll")
            .then(list => {
              this.listaPDVa = list.body;

            })
        },
        (err) => {
          alert('Doslo je do greske');

        })
    },
    nextTo(p,i){
     this.$store.state.nextEntity = p;
     if (i === 1){
       this.$router.push('/stopa');
     } else {
       this.$router.push('/grupa');
     }


   }
  },
  created() {
    this.$http.get('api/pdv/getAll').then(response => {
      this.listaPDVa = response.body;
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

    tr {
      th:last-of-type{
        width: 350px;

        i {
          position:relative;
          top:4px;
        }
      }

      .operations {
        span {
          display:flex;
          justify-content: center;
          align-items: center;


        }
      }
    }
  }
}
</style>
