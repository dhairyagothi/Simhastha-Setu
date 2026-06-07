export function seedIfEmpty(){
  if(!localStorage.getItem('seeded')){
    const incidents = [
      {id:'SS-1', type:'Medical', severity:'P1', summary:'Person collapsed', location:'Ram Ghat · Sector 4', time: new Date().toISOString(), status:'Open'},
      {id:'SS-2', type:'Fire', severity:'P2', summary:'Small fire near ghat', location:'Triveni Ghat', time: new Date().toISOString(), status:'Open'},
      {id:'SS-3', type:'Missing', severity:'P3', summary:'Lost child', location:'Mahakal Mandir', time: new Date().toISOString(), status:'Open'},
      {id:'SS-4', type:'Crowd Crush', severity:'P1', summary:'Overcrowding', location:'Ram Ghat', time: new Date().toISOString(), status:'Open'},
      {id:'SS-5', type:'Medical', severity:'P3', summary:'Heat exhaustion', location:'Freeganj Sector', time: new Date().toISOString(), status:'Open'}
    ]

    const units = [
      {id:'Amb-1', name:'Ambulance-1', type:'Ambulance', status:'Available', location:'Depot'},
      {id:'Amb-2', name:'Ambulance-2', type:'Ambulance', status:'On Scene', location:'Ram Ghat'},
      {id:'Fire-1', name:'FireTruck-1', type:'Fire', status:'Available', location:'Station'},
      {id:'NDRF-1', name:'NDRF-Alpha', type:'NDRF', status:'Available', location:'Base'}
    ]

    const alerts = [
      {id:'A-1', from:'Police', to:'Medical', msg:'Ambulance dispatched to Ram Ghat', time: new Date().toISOString()},
      {id:'A-2', from:'Medical', to:'Police', msg:'Need lane clearance', time: new Date().toISOString()}
    ]

    const missing = [
      {id:'MP-1', name:'Sita Devi', age:32, lastSeen:'Ram Ghat', photo:'', matched:false},
      {id:'MP-2', name:'Raju', age:8, lastSeen:'Triveni Ghat', photo:'', matched:true, confidence:0.87}
    ]

    localStorage.setItem('incidents', JSON.stringify(incidents))
    localStorage.setItem('units', JSON.stringify(units))
    localStorage.setItem('alerts', JSON.stringify(alerts))
    localStorage.setItem('missing', JSON.stringify(missing))
    localStorage.setItem('seeded','1')
  }
}
