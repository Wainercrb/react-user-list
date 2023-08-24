import { USER_KEY_ACTION_MAP, type User, type UserList } from '../types'

interface Props {
  isColorEnabled: boolean
  users: UserList
  handleDeleteUserIdByUUID: (uuid: keyof User['login']['uuid']) => void
  handleSortBy: (key: USER_KEY_ACTION_MAP) => void
}

export function UserListComponent ({ isColorEnabled, users, handleDeleteUserIdByUUID, handleSortBy }: Props) {
  return (
    <>
      <table className={isColorEnabled ? 'table-colors' : '' }>
        <tbody>
          <tr>
            <th>Photo</th>
            <th onClick={() => { handleSortBy(USER_KEY_ACTION_MAP.NAME) }}>Name</th>
            <th onClick={() => { handleSortBy(USER_KEY_ACTION_MAP.FIRST) }}>First</th>
            <th onClick={() => { handleSortBy(USER_KEY_ACTION_MAP.COUNTRY) }}>Country</th>
            <th>Actions</th>

          </tr>
          {users.map((item, idx) => (

            <tr key={idx}>
              <td>
                <img src={item.picture.thumbnail} alt={item.name.first} />
              </td>
              <td>{item.name.first}</td>
              <td>{item.name.last}</td>
              <td>{item.location.country}</td>
              <td>
                <div>
                  <button onClick={() => { handleDeleteUserIdByUUID(item.login.uuid as any) }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
