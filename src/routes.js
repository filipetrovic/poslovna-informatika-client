import HelloWorld from './components/HelloWorld.vue';
import ProizvodComponent from './components/ProizvodComponent.vue'
import StavkaCenovnikaComponent from './components/StavkaCenovnikaComponent.vue'
import CenovnikComponent from './components/CenovnikComponent.vue'
import GrupaProizvoda from './components/GrupaProizvoda.vue'
import PDVComponent from './components/PDVComponent.vue'
import StopaPDVComponent from './components/StopaPDVComponent.vue'
import JedinicaMereComponent from './components/JedinicaMereComponent.vue'
import NarudzbenicaComponent from './components/NarudzbenicaComponent.vue'
import PravljenjeNarudzbeniceComponent from './components/PravljenjeNarudzbeniceComponent.vue'
import FakturaComponent from './components/FakturaComponent.vue'
import DnevnikFakturaComponent from './components/DnevnikFakturaComponent.vue'

export const routes = [
    {path: '*', redirect: '/home'},
    {path: '/home', component: HelloWorld},
    {path: '/proizvod', component: ProizvodComponent},
    {path: '/stavka', component: StavkaCenovnikaComponent},
    {path: '/cenovnik', component: CenovnikComponent},
    {path: '/grupa', component: GrupaProizvoda},
    {path: '/pdv', component: PDVComponent},
    {path: '/stopa', component: StopaPDVComponent},
    {path: '/jedinicaMere', component: JedinicaMereComponent},
    {path: '/narudzbenica', component: NarudzbenicaComponent},
    {path: '/pravljenjeNarudzbenice', component: PravljenjeNarudzbeniceComponent},
    {path: '/faktura', component: FakturaComponent},
    {path: '/dnevnik', component: DnevnikFakturaComponent},
]
