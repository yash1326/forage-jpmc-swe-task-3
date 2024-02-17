import { ServerRespond } from './DataStreamer';

export interface Row {  // this row has to be same as 'schema' in Graph.tsx
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


//generateRow function will process the data that is received from the server.
//we will calculate price of abc, def, upper bound, lower bound and trigger alert.
export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) : Row {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ?
          serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}

//this file is responsible for processing raw stock data we receive from the server before the graph
// component renders it.