import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker' // importamos datepicker js
import 'react-datepicker/dist/react-datepicker.css' // importamos datepicker css

export default class CreateNote extends Component {
    //definimos el estado
    state = {
        users: [],
        userSelected: '',
        title: '',
        content: '',
        date: new Date(),
        editing: false,
        _id: ''
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/users'); //obtenemos usuarios
        this.setState({ 
            users: res.data.map(user => user.username), //guardamos solo el nombre de usuario
            userSelected: res.data[0].username
        })
        if (this.props.match.params.id) {
            //buscamos todos los datos de la nora a editar y la guardamos en res
            const res = await axios.get('http://localhost:4000/api/notes/'+ this.props.match.params.id);
            this.setState({
                title: res.data.title,
                content: res.data.content,
                date: new Date(res.data.date), //tenemos un string y lo convertimos a fecha
                userSelected: res.data.author,
                editing: true,  //colocamos la bandera de actualizacion en true
                _id: this.props.match.params.id //guardamos en _id el id de la nota a actualizar
            })
        }
    }
    onSubmit = async (e) => {
        e.preventDefault();  //evita que reinicie la pagina al darle al boton
        const newNote = {
            title: this.state.title,
            content: this.state.content,
            date: this.state.date,
            author: this.state.userSelected
        }
        if (this.state.editing){ //si el estado de editing es true
            await axios.put('http://localhost:4000/api/notes/'+ this.state._id, newNote);
        } else{
            await axios.post('http://localhost:4000/api/notes', newNote);
        }
        window.location.href = '/'; //redirecciono a notes, luego de crear nota.
    }
    onInputChange = e => {//captura el usuario que el usuario escoja
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    onChangeDate = date => { //metodo para que pueda cambiar la fecha escogida por el usuario
        this.setState({date}); 

    }
    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create a Notice</h4>

                    {/** SELECT USER*/}
                    <div className="form-group">
                        <select
                            className="form-control"
                            name="userSelected"//el nombre lo captura y lo guarda en el estado arriba
                            onChange={this.onInputChange} //captura el user k el usuario escoja
                            value={this.state.userSelected}
                        >
                            {
                                this.state.users.map(user =>
                                    <option key={user} value={user}>
                                        {user}
                                    </option>)
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title1"
                            name="title"//el title lo captura y lo guarda en el estado arriba
                            onChange={this.onInputChange}
                            value={this.state.title}
                            required />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="content"
                            className="form-control"
                            placeholder="Content"//el content lo captura y lo guarda en el estado arriba
                            onChange={this.onInputChange}
                            value={this.state.content}
                            required
                        >
                        </textarea>
                    </div>
                    <div className="form-group">
                        <DatePicker
                            className="form-control"
                            selected={this.state.date}
                            onChange={this.onChangeDate}//se usa para reflejar el cambio del comp en pantalla

                        />
                    </div>
                    <form onSubmit={this.onSubmit}>

                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}
