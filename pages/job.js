import React from 'react'
import Layout from '../components/Layout'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getJob } from '../actions/actions'
import withRedux from 'next-redux-wrapper'
import ArticleLayout from '../components/article/ArticleLayout'

export class Job extends React.Component {
  static async getInitialProps ({store, isServer, pathname, query}) {
    const id = query.id
    await store.dispatch(getJob(id))
    const reports = store.getState().jobReports
    const report = reports.filter((obj) => {
      return parseInt(obj.id, 10) === parseInt(id, 10)
    })[0]
    return {
      report: report
    }
  }

  render () {
    return (
      <Layout title={this.props.report.fields.title}>
        <ArticleLayout report={this.props.report} type='job' />
      </Layout>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getJob: bindActionCreators(getJob, dispatch)
  }
}

export default withRedux(initStore, null, mapDispatchToProps)(Job)