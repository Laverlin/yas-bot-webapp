import { IWayPoint } from "./IWayPoint";

export interface IYasRoute {
    routeId: number,
    userId: number,
    RouteName: string,
    RouteDate: Date,
    wayPoints: IWayPoint[] 
}
