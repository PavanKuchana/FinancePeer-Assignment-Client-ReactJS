import Cookies from 'js-cookie'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import UserItem from '../UserItem'
import Header from '../Header'

import './index.css'

class Home extends Component {
  state = {upload: [], gotData: [], showData: false, uploaded: false}

  uploadFileToDatabase = async event => {
    event.preventDefault()
    const {upload} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://pavan-kuchana-financepeer-app.herokuapp.com/data/'
    const options = {
      method: 'POST',
      headers: {
        'access-control-allow-origin': '*',
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upload),
    }

    try {
      const response = await fetch(apiUrl, options)
      console.log(response)
      this.setState({uploaded: true})
    } catch {
      // eslint-disable-next-line
      alert('Upload Failed')
    }
  }

  logFile = event => {
    const str = event.target.result
    const json = JSON.parse(str)
    this.setState({upload: json})
  }

  handleSubmit = event => {
    event.preventDefault()
    const reader = new FileReader()
    reader.onload = this.logFile
    reader.readAsText(event.target.files[0])
  }

  changeOnUpload = event => {
    this.handleSubmit(event)
  }

  getDataFromDatabase = async () => {
    this.setState({uploaded: false})
    const myToken = Cookies.get('jwt_token')
    const apiUrl = 'https://pavan-kuchana-financepeer-app.herokuapp.com/return/'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${myToken}`,
        'access-control-allow-origin': '*',
      },
    }
    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      const finalData = data.getFromDatabase
      this.setState({gotData: finalData, showData: true})
    } catch {
      console.log('API ERROR')
    }
  }

  renderData = () => {
    const {gotData} = this.state
    if (gotData.length > 0) {
      return (
        <div>
          <h1 className="users-main-heading">Users Data</h1>
          <ul className="data-list-container">
            {gotData.map(eachItem => (
              <UserItem key={eachItem.id} dataDetails={eachItem} />
            ))}
          </ul>
        </div>
      )
    }
    return (
      <div>
        <h1 className="no-data">
          No Data in Database,
          <br />
          Please Upload JSON File with Data.
        </h1>
      </div>
    )
  }

  render() {
    const isCookie = Cookies.get('jwt_token')
    if (isCookie === undefined) {
      return <Redirect to="/login" />
    }
    const {showData, uploaded} = this.state

    return (
      <>
        <Header />
        <div className="home-container">
          <div className="home-content">
            <h1 className="home-heading">Upload Your File Below</h1>
            <form className="upload-form" onSubmit={this.uploadFileToDatabase}>
              <input
                onChange={this.changeOnUpload}
                type="file"
                className="file-input"
              />
              <button className="button" type="submit">
                Submit
              </button>
              <button
                type="button"
                onClick={this.getDataFromDatabase}
                className="button"
              >
                Load Data
              </button>
            </form>
            {uploaded ? (
              <div className="alert">
                <p>Data has been uploaded to database!</p>
              </div>
            ) : null}
          </div>
          <div>{showData ? this.renderData() : null}</div>
        </div>
      </>
    )
  }
}
export default Home
