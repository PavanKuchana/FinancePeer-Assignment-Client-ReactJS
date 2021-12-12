import './index.css'

const UserItem = props => {
  const {dataDetails} = props
  // eslint-disable-next-line
  const {userId, title, body} = dataDetails
  return (
    <>
      <li className="data-cont">
        <h1 className="title">{title}</h1>
        <p className="body">{body}</p>
      </li>
    </>
  )
}
export default UserItem
