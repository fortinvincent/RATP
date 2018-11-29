import * as React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries
} from 'react-vis';

import './App.css'

interface IState {
  readonly stationTrafic: IStationDetail[]
}

interface IStationDetail {
  readonly station: string
  readonly trafic: number
  readonly rang: number
}

export class Trafic extends React.PureComponent<{}, IState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      stationTrafic: []
    }
  }

  // function called before render to make requests on the external API
  public componentWillMount(): void {
    fetch('https://data.ratp.fr/api/v2/catalog/datasets/trafic-annuel-entrant-par-station-du-reseau-ferre-2017/exports/json').then(
      result => result.json().then(
        (stationTrafic: IStationDetail[]) => this.setState({
          stationTrafic: stationTrafic.map(station => ({
              station: station.station,
              rang: station.rang,
              trafic: station.trafic,
            })
          )
        })
      ))
  }

  public render(): JSX.Element {
    const myData = this.state.stationTrafic.map(station => 
      ({id: '00036', y: station.trafic, x: station.rang})
    )

    return (
      <div>
        <XYPlot
          margin={{left: 75}}
          width={600}
          height={600}
        >
          <VerticalBarSeries className="vertical-bar-series-example" data={myData} />
          <XAxis />
          <YAxis marginLeft={100}/>
        </XYPlot>
      </div>
    )
  }
}

