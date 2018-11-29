import * as React from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';


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
    return (
      <div>
        <XYPlot
          width={300}
          height={300}>
          <HorizontalGridLines />
          <LineSeries
            data={[
              {x: 1, y: 10},
              {x: 2, y: 5},
              {x: 3, y: 15}
            ]}/>
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
    )
  }
}

