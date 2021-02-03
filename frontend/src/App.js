import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewGroupId: null,
      activeItem: {
        title: "",
        description: "",
        url:"",
        groupId: ""
      },
      linkList: [],
      groupLinksList:[]
    };
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios
      .get("api/links/")
      .then(res => this.setState({ linkList: res.data }))
      .catch(err => console.log(err));
    axios
      .get("api/groups_links/")
      .then(res => this.setState({ groupLinksList: res.data }))
      .catch(err => console.log(err));
  };
  displayGroup = groupId => {    
    return this.setState({ viewGroupId: groupId });    
  };
  renderTabList = () => {    
    return (
      <div className="my-5 tab-list">
        {
          this.state.groupLinksList.map(item => (
            <span onClick={() => this.displayGroup(item.id)} className={this.state.viewGroupId === item.id ? "active" : ""}>
              {item.title}
            </span>
          ))
        }
        <span onClick={() => this.displayGroup(null)} className={this.state.viewGroupId === null ? "active" : ""}>
          Other
        </span>
      </div>
    );
  };
  renderItems = () => {
    const { viewGroupId } = this.state;
    const newItems = this.state.linkList.filter(
      item => item.groupId === viewGroupId
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 `}
          title={item.description}
        >
          {item.title} |
          <a href={item.url}>{item.url}</a>
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
            Edit{" "}
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete{" "}
          </button>
        </span>
      </li>
    ));
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios
        .put(`api/links/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("api/links/", item)
      .then(res => this.refreshList());
  };
  handleDelete = item => {
    axios
      .delete(`api/links/${item.id}`)
      .then(res => this.refreshList());
  };
  createItem = () => {
    const item = { title: "", description: "", groupId:"", url:"" };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  render() {
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Links app</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add link
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            groupLinksList={this.state.groupLinksList}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;