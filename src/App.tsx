import { useEffect, useState, useRef, useMemo } from 'react'
import { USER_KEY_ACTION_MAP, type User, type UserList } from './types'
import { UserListComponent } from './components/userList'
import './App.css'

const USER_KEY_ACTION: Record<USER_KEY_ACTION_MAP, (user: User) => string> = {
  COUNTRY: (user: User) => user.location.country,
  NAME: (user: User) => user.name.first,
  FIRST: (user: User) => user.name.last,
  NONE: (user: User) => user.login.uuid
}

function App () {
  const [userList, setUserList] = useState<UserList>([])
  const initialUserList = useRef<UserList>([])
  const [sortBy, setSortBy] = useState<USER_KEY_ACTION_MAP>(USER_KEY_ACTION_MAP.NONE)
  const [queryToFilterByCountry, setQueryToFilterByCountry] = useState('')
  const [isColorEnabled, setIsColorEnabled] = useState(false)

  const handleResetUserToInitialState = () => {
    setQueryToFilterByCountry('')
    setSortBy(USER_KEY_ACTION_MAP.NONE)
    setUserList(initialUserList.current)
  }

  const handleSortBy = (key: USER_KEY_ACTION_MAP) => {
    if (key === sortBy) {
      setSortBy(USER_KEY_ACTION_MAP.NONE)
      return
    }

    setSortBy(key)
  }

  const handleDeleteUserByUUID = (uuid: keyof User['login']['uuid']) => {
    const cleanUserList = [...userList].filter(item => item.login.uuid !== uuid)
    setUserList(cleanUserList)
  }

  const filteredUserList = useMemo(() => {
    console.log('filter is running')
    return [...userList].filter(item => {
      if (queryToFilterByCountry.length <= 0) {
        return true
      }

      return item.location.country.toLowerCase().includes(queryToFilterByCountry.toLowerCase())
    })
  }, [userList, queryToFilterByCountry])

  const sortedUserList = useMemo(() => {
    console.log('sort is running')
    return [...filteredUserList].sort((a, b) => {
      return USER_KEY_ACTION[sortBy](a).localeCompare(USER_KEY_ACTION[sortBy](b))
    })
  }, [filteredUserList, sortBy])

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async response => {
        return await response.json()
      }).then(response => {
        const { results } = response

        setUserList(results)
        initialUserList.current = results
      }).catch(console.error)
  }, [])

  return (
    <section>
      <h1>Technical Assignment User List And Filter </h1>
      <div>
        <button onClick={() => { setIsColorEnabled(!isColorEnabled) } }>{ !isColorEnabled ? 'Enable Colors' : 'Disable Colors'}</button>
        <button onClick={handleResetUserToInitialState}>Reset</button>
        <button onClick={() => { handleSortBy(USER_KEY_ACTION_MAP.COUNTRY) } }>Filter By Country</button>
        <input type="text" placeholder='Filter by country' onChange={(evt) => { setQueryToFilterByCountry(evt.target.value) } } />
      </div>

      <UserListComponent
        isColorEnabled={isColorEnabled}
        users={sortedUserList}
        handleDeleteUserIdByUUID={handleDeleteUserByUUID}
        handleSortBy={handleSortBy}
        />

    </section>
  )
}

export default App
