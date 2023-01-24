import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
interface State{
  
  tarhelynev:string;
  tarhelymeret:number;
  tarhelyar:number;

  errormess:string;
  deletehelp:number;
  
  tarhelyek:[];

}
interface Tarhely{
  id:number;
  nev:string;
  meret:number;
  ar:number;
}
interface TarhelyekResponse{
  rows:Tarhely[];
}
class App extends Component<{}, State> {
  constructor(props: {}){
    super(props);
    this.state={
      tarhelyek:[],
      tarhelynev:"",
      tarhelymeret:0,
      tarhelyar:0,
      errormess:"",
      deletehelp:0
    }
  }
  loadData=async()=>{
    let response=await fetch('http://localhost:3000/api/tarhely');
    let data=await response.json()as TarhelyekResponse;
    this.setState({
      tarhelyek: data.rows,
    })
  }
componentDidMount() {
  this.loadData()
}
addToDB=async()=>{
   const{tarhelynev,tarhelymeret,tarhelyar}=this.state
   this.setState({errormess:""})
   
   if(tarhelynev.trim() == ""){
    this.setState({errormess:"nem lehet ures a nev mezo"})
    return
   }
   if(tarhelymeret<0){
    this.setState({errormess:"a meret nem lehet negativ"})
    return
   }
   if(tarhelymeret==null|| Number.isNaN(tarhelymeret)){
    this.setState({errormess:"a meret mezo nem lehet ures"})
    return
   }
   if(tarhelyar<0){
    this.setState({errormess:"ay ar nem lehet negativ"})
    return
   }
   if(tarhelyar==null||Number.isNaN(tarhelyar)){
    this.setState({errormess:"ay ar mezo nem maradhat uresen"})
    return
   }
   const data={
    nev:tarhelynev,
    meret:tarhelymeret,
    ar:tarhelyar
   }
   await fetch('http://localhost:3000/api/tarhely',{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
   })
   this.setState({
    tarhelynev:"",
    tarhelymeret:0,
    tarhelyar:0,
    errormess:"",
   })
   await this.loadData()
}
deleteFromDtbase=async(id:number)=>{
  await fetch('http://localhost:3000/api/tarhely/'+id,{
    method:'DELETE'
  })
  this.loadData()
}
render(){
  const{tarhelynev, tarhelymeret, tarhelyar, errormess} = this.state
  return<div>
    <div className='container'>
      <div className='row justify-content-center'>
        <div className="col-sm-4 text-center">
          Tarhely nev:<br/><input type="text"value={tarhelynev}onChange={e =>this.setState({tarhelynev:e.currentTarget.value})}/>

        </div>
      </div>
      <div className='row justify-content-center'>
        <div className="col-sm-4 text-center">
          Tarhely merete:<br/><input type="number" min={0} value={tarhelymeret} onChange={e=>this.setState({tarhelymeret:parseInt(e.currentTarget.value)})}/>

        </div>
      </div>
      <div className='row justify-content-center'>
        <div className="col-sm-4 text-center">
          Tarhely csomag ar/ho:<br/><input type="number" min={0} value={tarhelyar} onChange={e=>this.setState({tarhelyar:parseInt(e.currentTarget.value)})}/>

        </div>
      </div>
      <div className='row justify-content-center mt-3'>
        <div className="col text-center">
        <button className='btn btn-secondary' onClick={this.addToDB}>Felvesz</button><br/>

        </div>
      </div>
      <div className='row justify-content-center mt-3'>
        <div className="col text-center">
          <p className='text-dange'>{errormess}</p>
        </div>
      </div>
    </div>
    <div className='row'>
      {this.state.tarhelyek.map(item=>(
        <div className='col-md-4'>
          <div className="card text-center">
            <div className="card-body">
              nev:{item.nev}<br/>
              méret:{item.meret}GB<br/>
              ar:{item.ar}ft
            </div>
            <div className='card-footer'>
              <button onClick={(event)=>this.deleteFromDtbase(item.id)}>Torles</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
}
}

export default App;
