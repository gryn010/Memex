import React, { PureComponent } from 'react'
import OnClickOutside from 'react-onclickoutside'
import moment from 'moment'
import { ButtonTooltip } from 'src/common-ui/components/'
import classNames from 'classnames'

const dashboardStyles = require('./filter-button.css')
const sidebarStyles = require('./filter-button-sidebar.css')

interface Props {
    env: 'overview' | 'inpage'
    chidren?: React.ReactNode
    source: string
    filteredItems: object[]
    displayFilters?: React.ReactNode
    startDate?: number
    endDate?: number
    togglePopup: React.MouseEventHandler<HTMLButtonElement>
    hidePopup: () => void
    clearFilters: () => void
    onFilterDel?: (args: any) => void
}

interface State {
    typesCount: number
    showDatesClearBtn: boolean
}

class FilterButton extends PureComponent<Props, State> {
    state: State = {
        typesCount: null,
        showDatesClearBtn: false,
    }

    get styles() {
        if (this.props.env === 'overview') {
            return dashboardStyles
        }
        return sidebarStyles
    }

    private handleClickOutside = (e: Event) => {
        e.stopPropagation()
        this.props.hidePopup()
    }

    private handleClearFilters: React.MouseEventHandler<
        HTMLSpanElement
    > = e => {
        e.stopPropagation()
        this.props.clearFilters()
        this.props.hidePopup()
    }

    private renderCount() {
        if (this.props.source === 'Types' && this.state.typesCount) {
            return (
                <React.Fragment>
                    <span className={this.styles.tagCount}>
                        {this.state.typesCount + '/ 2'}
                    </span>
                    <span
                        className={this.styles.clearFilters}
                        onClick={this.handleClearFilters}
                    />
                </React.Fragment>
            )
        } else if (
            this.props.source === 'Dates' &&
            (this.props.startDate || this.props.endDate)
        ) {
            return (
                <React.Fragment>
                    <div className={this.styles.dateBox}>
                        <span className={this.styles.detailsFilter}>
                            {moment(this.props.startDate).format(
                                'MMM DD, YYYY',
                            ) +
                                ' - ' +
                                moment(this.props.endDate).format(
                                    'MMM DD, YYYY',
                                )}
                        </span>
                    </div>
                </React.Fragment>
            )
        } else if (this.props.source === 'Domains' || 'Tags') {
            return (
                <React.Fragment>
                    {this.props.filteredItems.length > 0 && (
                        <React.Fragment>
                            <span>{this.props.filteredItems.length}</span>
                            <ButtonTooltip
                                tooltipText="Clear this Filter"
                                position="bottom"
                            >
                                <span
                                    className={this.styles.clearFilters}
                                    onClick={this.handleClearFilters}
                                />
                            </ButtonTooltip>
                        </React.Fragment>
                    )}
                </React.Fragment>
            )
        }
    }

    render() {
        return (
            <div>
                <button
                    className={classNames(this.styles.tagButton, {
                        [this.styles.tagButtonSelected]: this.props
                            .filteredItems.length,
                        [this.styles.tagButtonDate]:
                            this.props.startDate || this.props.endDate,
                    })}
                    onClick={this.props.togglePopup}
                >
                    {this.props.source === 'Dates' ? (
                        <React.Fragment>
                            <div className={this.styles.dateTopBox}>
                                {this.props.source}
                                {(this.props.startDate ||
                                    this.props.endDate) && (
                                    <span
                                        className={this.styles.clearFilters}
                                        onClick={this.handleClearFilters}
                                    />
                                )}
                            </div>
                            {this.renderCount()}
                        </React.Fragment>
                    ) : (
                        <div className={this.styles.pillContent}>
                            {this.props.source}
                            <span className={this.styles.renderCount}>
                                {this.renderCount()}
                            </span>
                        </div>
                    )}
                </button>
                {this.props.children}
            </div>
        )
    }
}

export default OnClickOutside(FilterButton)
