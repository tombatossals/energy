import React from 'react'
import moment from 'moment'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import InfiniteCalendar from 'react-infinite-calendar'
import 'react-infinite-calendar/styles.css'

class DatePicker extends React.Component {
  render () {
    return (
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose}>
          <InfiniteCalendar
            height={400}
            onSelect={this.props.onSelect}
            maxDate={moment().subtract(2, 'day')}
            max={moment().subtract(2, 'day')}
          />
        </ModalDialog>
      </ModalContainer>
    )
  }
}

DatePicker.propTypes = {
  onClick: React.PropTypes.func,
  onClose: React.PropTypes.func,
  onSelect: React.PropTypes.func
}

export default DatePicker
