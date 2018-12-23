import React from 'react';
import ReactDOM from 'react-dom';
import { Autocomplete, TextInput, Icon } from 'evergreen-ui';
import firebase from 'firebase';
import ReactModal from 'react-modal';
import styled from 'styled-components'
let data = require('./drugs.json');
let drugAlt = [];
let changeItem;



let Input = styled.input`
display:block;
background-color: white;
border-radius: 3px;
border : 1px solid rgb(211, 211, 211);
font-size: 1rem;
font-color: grey;
height: 30px;
width: 200px;
padding: 0px 10px;
margin-left: 180px
`

let Navigation = styled.header`
  background-color: #fff;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10%;
`

let Navigation2 = styled.header`
  background-color: #fff;
  height: 80px;
  width:800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 10%;
  box-shadow: none;
`

let Navigation3 = styled.header`
  background-color: #fff;
  height: 120px;
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30%;
  box-shadow: none;
`
let Navigation4 = styled.header`
  height: 10px;
  width: 400px;
  display: flex;
  box-shadow: none;
`
let Navigation5 = styled.header`
  height: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: none;

`
let Navigation6 = styled.header`
  justify-content: Auto;
  height:20px;
  display: flex;
  margin: 0px 20px;
  box-shadow: none;
`

let Navigation7 = styled.header`
  justify-content: center;
  height:0px;
  box-shadow: none;
  font-weight: bold;
  font-size:30px
`

let Button = styled.button`
background-color: #77439d;
padding: 10px;
border-radius: 3px;
border: none;
color: #77439d;
font-weight: bold;
font-color: white;
height:40px
min-width:100px;
`

let ICON = styled.div`
margin-bottom: 20px
`

let Drugs = styled.div`
background-color: white;
border-radius: 3px;
border : 1px solid rgb(211, 211, 211);
font-size: 1.25rem;
font-color: grey;
width: 400px;
height: 30px;
margin-bottom: 10px
margin-left: 400px

`

let DrugList = styled.div`
background-color: #f2f2f2;
padding: 10px;
border-radius: 3px;
border: none;
color:black;
font-weight:bold;
width:90%;
padding: 20px 10px
text-transform: capitalize;
justify-content: Auto;
`


var config = {
    apiKey: "AIzaSyC2Lss12d88nZC82fZMrWG2x54cZ2YKVTw",
    authDomain: "prescriptions-project.firebaseapp.com",
    databaseURL: "https://prescriptions-project.firebaseio.com",
    projectId: "prescriptions-project",
    storageBucket: "prescriptions-project.appspot.com",
    messagingSenderId: "252689610994"
};
firebase.initializeApp(config);



class App extends React.Component {

    constructor() {
        super();
        this.state = {
            items: data,
            modal: false,
            fireDrug: [],
            name: '',
            age: '',
            date: '',
            prescriptions: [],

        }


        firebase.firestore().collection("PatientInfo.").orderBy('date', 'asc').onSnapshot(snapshot => {
            let prescription = [];
            snapshot.forEach(doc => {
                prescription.push(doc.data());
            });
            this.setState({
                prescriptions: prescription
            })
        })


    }

    modalStatus() {
        let modalst = !this.state.modal
        this.setState({
            modal: modalst
        })
    }


    print() {
        window.print()
    }

    render() {
        return (
            <div>
                <header>
                    <Navigation>
                        <img width="130px;" src={require('./assets/logo.png')} />
                        <Button id="button1" onClick={() => { this.modalStatus() }}>Add Prescription</Button>
                    </Navigation>

                    <ReactModal
                        isOpen={this.state.modal}
                        contentLabel="MODAL">
                        <Navigation7>
                            Add Prescription
                        </Navigation7>
                        <Navigation2>
                            <Input type="text" placeholder="Name" onChange={(event) => {
                                this.setState({
                                    name: event.target.value
                                })
                            }} value={this.state.name} />

                            <Input type="number" placeholder="Age" onChange={(event) => {
                                this.setState({
                                    age: event.target.value
                                })
                            }} value={this.state.age} />
                        </Navigation2>

                        <Autocomplete
                            title="DRUGS"
                            onChange={changedItem => {
                                changeItem = changedItem
                            }}
                            items={this.state.items}>
                            {(props) => {
                                const { getInputProps, getRef, inputValue, openMenu } = props
                                return (
                                    <div>
                                        <TextInput marginLeft={400} marginBottom={20} width={400}

                                            placeholder="Select A Drug"
                                            value={inputValue}
                                            innerRef={getRef}
                                            {...getInputProps({

                                                onFocus: () => {

                                                    openMenu()

                                                }
                                            })}


                                            onKeyUp={(event) => {
                                                if (event.key == "Enter") {
                                                    drugAlt.push(changeItem)
                                                    this.setState({
                                                        fireDrug: drugAlt
                                                    })
                                                }
                                                props.clearSelection()
                                            }}
                                        />


                                        <Drugs>{this.state.fireDrug + ''}</Drugs>


                                    </div>

                                )
                            }}

                        </Autocomplete>



                        <Navigation3>
                            <Button id="save" onClick={() => {
                                drugAlt = [];
                                this.setState({
                                    fireDrug: [],
                                    name: '',
                                    age: ''
                                })
                                this.modalStatus()
                                if (this.state.name != '') {
                                    firebase.firestore().collection('PatientInfo.').add({
                                        date: Date.now(),
                                        items: this.state.fireDrug,
                                        name: this.state.name,
                                        age: this.state.age
                                    })
                                }
                            }}>Save</Button>


                            < Button id="Close" onClick={() => {
                                drugAlt = [];
                                this.setState({
                                })
                                this.modalStatus()
                            }}>Close</Button>
                        </Navigation3>

                    </ReactModal>
                </header>
                <div >
                    {this.state.prescriptions.map((item, i) => {
                        return (
                            <DrugList className="DrugList" key={i}>

                                <img width="60px;" height="60px;" src={require('./assets/Pic.png')} />
                                <Navigation6>
                                    <Navigation5>
                                        <Navigation4>
                                            <div>patient name : {item.name}</div>
                                            <div>Age: {item.age}</div>
                                        </Navigation4>
                                        <div>Drugs: {item.items}</div>
                                    </Navigation5>


                                    <Icon className="print" key={i} marginRight={10} icon="print" color="#77439d" size={20} onClick={() => {
                                        this.print()
                                    }} />
                                </Navigation6>


                            </DrugList>
                        )
                    })}
                </div>


            </div >
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'))