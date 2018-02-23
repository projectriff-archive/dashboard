import React, { Component } from 'react';

class NamespaceList extends Component {
  state = {
    loading: true,
    error: null,
    namespaces: null
  };

  componentWillMount() {
    this.mounted = true;
    this.fetch();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async fetch() {
    try {
      const res = await fetch('/api/v1/namespaces/');
      const namespaces = await res.json();
      if (!this.mounted) return;
      this.setState({
        loading: false,
        namespaces
      });
    } catch (e) {
      if (!this.mounted) return;
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  render() {
    const { loading, error, namespaces } = this.state;

    if (error) {
      return (
        <div className="error">
          Unable to load namesapces
          <details>
            {error}
          </details>
        </div>
      );
    }

    return (
      <div className="NamespaceList">
        Namespaces:
        {loading
          ? <div className="loading">Loading...</div>
          : error
            ? <div className="error">
                Unable to load namesapces
                <details>
                  {error}
                </details>
              </div>
            : <ul>
                {namespaces.items.map(namespace => {
                  const { name, uid } = namespace.metadata;
                  return <li key={uid}>{name}</li>
                })}
              </ul>
        }
      </div>
    );
  }
}

export default NamespaceList;
