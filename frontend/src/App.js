import React, { Component } from "react";
import AddLinkModal from "./components/AddLinkModal";
import GroupSideBar from "./components/GroupSideBar";
import axios from "axios";
import Iframe from 'react-iframe'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGroupItem: {
        title:"",
        id:null
      },
      activeItem: {
        title: "",
        description: "",
        url:"",
        groupId: ""
      },
      linkList: [],
      groupLinksList:[],
      ifraimeUrl : ""
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
  displayGroup = item => {    
    return this.setState({ activeGroupItem: item });    
  };
  renderItems = () => {
    const { activeGroupItem } = this.state;
    const newItems = this.state.linkList.filter(
      item => item.groupId === activeGroupItem.id
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
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
        </span>
        <span>
          <button
            onClick={() => this.editLinkItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
            Edit{" "}
          </button>
          <button
            onClick={() => this.handleLinkDelete(item)}
            className="btn btn-danger"
          >
            Delete{" "}
          </button>
          <button
            onClick={() => this.handlePreview(item)}
            className="btn btn-link mr-2"
          >
            Preview{" "}
          </button>
        </span>
      </li>
    ));
  };
  toggleAddLinkModal = () => {
    this.setState({ addLinkModal: !this.state.addLinkModal });
  };
  handleLinkSubmit = item => {
    this.toggleAddLinkModal();    
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
  handleLinkDelete = item => {
    axios
      .delete(`api/links/${item.id}`)
      .then(res => this.refreshList());
  };
  handlePreview = item => {
    this.setState({ ifraimeUrl : item.url});
  }
  createLinkItem = () => {
    const item = { title: "", description: "", groupId:this.state.activeGroupItem.id, url:"" };
    this.setState({ activeItem: item, addLinkModal: !this.state.addLinkModal });
  };
  editLinkItem = item => {
    this.setState({ activeItem: item, addLinkModal: !this.state.addLinkModal });
  };
  render() {
    return (
      <main className="content">
        <div className="d-flex wrapper">
          <GroupSideBar
            setGroup={this.displayGroup}/>
          <div id="content">
            <div className="row ">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  <div className="">
                    <button onClick={this.createLinkItem} className="btn btn-primary">
                      Add link
                    </button>
                  </div>              
                  <ul className="list-group list-group-flush">
                    {this.renderItems()}
                  </ul>
                </div>
              </div>
            </div>
            {this.state.addLinkModal ? (
              <AddLinkModal
                activeItem={this.state.activeItem}
                groupLinksList={this.state.groupLinksList}
                toggle={this.toggleAddLinkModal}
                onSave={this.handleLinkSubmit}
              />
            ) : null}            
            {this.state.ifraimeUrl ? (
              <Iframe url={this.state.ifraimeUrl}
              width="450px"
              height="450px"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"/>
            ) : null}
          </div>
        </div>
      </main>
    );
  }
}
export default App;