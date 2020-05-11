import React, { Component } from 'react'
import axios from 'axios'

export default class CreateUser extends Component {

    state = {
        users: [],
        username: ''
    }

    async componentDidMount() {
        this.getUsers();
        console.log(this.state.users)
    }

    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    getUsers = async () => {
        const res = await axios.get('http://localhost:4000/api/users'); //obtiene todos los usuarios
        this.setState({ users: res.data }); //guardamos la respuesta en el estado aunque solo data
    }
    onSubmit = async (e) => {
        e.preventDefault();  //evita que reinicie la pagina al darle al boton
        await axios.post('http://localhost:4000/api/users', { //envia al servidor un post 
            username: this.state.username //username que esta guardado en el estado
        })
        this.setState({username: ''});
        this.getUsers(); //lo volvemos a actualizar para que muestre los nuevos datos
    }
    deleteUser = async (id) => {
        console.log(id)
        await axios.delete('http://localhost:4000/api/users/' + id);
        this.getUsers(); //se borra y luego ejecuta esto para refrescar
    }
    
    
    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card card-body">
                        <h3>Create New User</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <ul className="list-group">
                        {
                            this.state.users.map(user => (
                                <li
                                    className="list-group-item list-group-item-action"
                                    key={user._id}
                                    onDoubleClick={() => this.deleteUser(user._id)}
                                    >
                                    {user.username}
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
