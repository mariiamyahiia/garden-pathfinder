function Panel({ title, className = '', children }) {
  return (
    <section className={`panel ${className}`}>
      <h2 className="panel__title">{title}</h2>
      <div className="panel__body">{children}</div>
    </section>
  )
}

export default Panel