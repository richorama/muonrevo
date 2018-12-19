const React = require('react')
const Page = require('./page.jsx')
const Panel = require('./panel.jsx')

module.exports = class extends React.Component {
  constructor(props) {
    super(props)

    this.state = { title: '' }
    this.updateParent = this.updateParent.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
  }

  updateParent() {
    this.props.onUpdate(this.state)
  }

  handleTitleChange() {
    this.setState({ title: this.refs.title.value }, this.updateParent)
  }

  render() {
    return (
      <Page>
        <Panel title="Add a new folder">
          <div>
            <div>
              <input
                className="form-control input-lg"
                type="text"
                placeholder="Enter a folder name..."
                value={this.state.title}
                onChange={this.handleTitleChange}
                ref="title"
              />
            </div>
          </div>
        </Panel>
      </Page>
    )
  }
}
