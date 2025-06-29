const Number = ({ persons, filter }) => {
  const personsToShow = persons
    .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    .map(person => (
      <div key={person.name}>
        {person.name} {person.number}
      </div>
    ))

  return (
    <div>
      {personsToShow}
    </div>
  )
}

export default Number