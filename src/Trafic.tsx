import * as React from 'react';

interface IState {
  readonly stationTrafic?: IStationDetail[]
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
      stationTrafic: undefined
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
      <pre>{JSON.stringify(this.state.stationTrafic, null, 2)}</pre>
    )
  }
}

