const SEED_VERSION = '2028-ui-spec-v2'

export function seedIfEmpty(){
  if(localStorage.getItem('seeded') !== SEED_VERSION){
    const now = new Date().toISOString()
    const incidents = [
      {id:'SS-2101', type:'Medical', severity:'P1', summary:'Woman fainted near Ram Ghat entrance', location:'Ram Ghat · Sector 4', time: now, status:'Open', lat:23.1828, lng:75.7682, mergedReports:4},
      {id:'SS-2102', type:'Medical', severity:'P1', summary:'Old man collapsed at lower steps', location:'Ram Ghat · Sector 4', time: now, status:'Merged', lat:23.1832, lng:75.7686},
      {id:'SS-2103', type:'Medical', severity:'P2', summary:'Heat exhaustion near queue barricade', location:'Ram Ghat · Sector 4', time: now, status:'Merged', lat:23.1824, lng:75.7678},
      {id:'SS-2104', type:'Crowd Crush', severity:'P1', summary:'Pressure building at narrow lane exit', location:'Ram Ghat south lane', time: now, status:'Open', lat:23.1818, lng:75.7691},
      {id:'SS-2105', type:'Fire', severity:'P2', summary:'Smoke reported behind food stall', location:'Triveni Ghat service lane', time: now, status:'Open', lat:23.1794, lng:75.7714},
      {id:'SS-2106', type:'Missing', severity:'P2', summary:'Lost child wearing yellow kurta', location:'Mahakal Mandir Gate 2', time: now, status:'Open', lat:23.1821, lng:75.7652},
      {id:'SS-2107', type:'Security', severity:'P3', summary:'Barricade breach attempt', location:'Mahakal corridor', time: now, status:'Open', lat:23.1808, lng:75.7644},
      {id:'SS-2108', type:'Drowning', severity:'P1', summary:'Pilgrim slipped near water edge', location:'Ram Ghat lower steps', time: now, status:'Open', lat:23.1835, lng:75.7696}
    ]

    const units = [
      {id:'Amb-1', name:'Ambulance-1', type:'Ambulance', status:'Available', location:'Medical Depot', lat:23.1815, lng:75.7668},
      {id:'Amb-2', name:'Ambulance-2', type:'Ambulance', status:'Available', location:'Ram Ghat standby', lat:23.184, lng:75.7674},
      {id:'Fire-1', name:'FireTruck-1', type:'Fire', status:'Available', location:'Station 3', lat:23.1789, lng:75.7701},
      {id:'Police-1', name:'Police QRT-1', type:'Police', status:'Available', location:'Mahakal corridor', lat:23.181, lng:75.764},
      {id:'NDRF-1', name:'NDRF-Alpha', type:'NDRF', status:'Available', location:'Ram Ghat base', lat:23.1839, lng:75.769}
    ]

    const alerts = [
      {id:'A-1', from:'POL', to:'MED', msg:'Keep ambulance lane clear for Ram Ghat Sector 4.', time: now},
      {id:'A-2', from:'MELA', to:'NDRF', msg:'Monitor density near lower steps for next 15 minutes.', time: now}
    ]

    const missing = [
      {id:'SS-MP-1042', name:'Sita Devi', age:32, lastSeen:'Ram Ghat help desk', photo:'', matched:false, status:'Searching'},
      {id:'SS-MP-2087', name:'Raju', age:8, lastSeen:'Triveni Ghat prasad stall', photo:'', matched:true, confidence:87, status:'Matched'}
    ]

    localStorage.setItem('incidents', JSON.stringify(incidents))
    localStorage.setItem('units', JSON.stringify(units))
    localStorage.setItem('alerts', JSON.stringify(alerts))
    localStorage.setItem('missing', JSON.stringify(missing))
    localStorage.setItem('seeded', SEED_VERSION)
    localStorage.setItem('resourceRequests', JSON.stringify([]))
  }
}
