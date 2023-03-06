import * as React from 'react';
import { Label } from '@fluentui/react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface IBurnDownChartComponent {
  name?: string;
  startDate: Date;
  endDate: Date;
  currentDate: Date;
  taskData: Array<Task>;
  availabilityData:Array<Available>;
}
type Task ={
  units: number,
  completionDate:Date
}
type Available ={
  units: number,
  date:Date
}

export class BurnDownChartComponent extends React.Component<IBurnDownChartComponent> {
    /*
  initiateState(): GanttViewControlState {return ({n: 0})};
  state: GanttViewControlState = this.initiateState();
  */
  constructor(props: IBurnDownChartComponent) {
    super(props);
    // Don't call this.setState() here!
    //this.state = { counter: 0 };
  }

  /**
   * Adds days to the provided date
   * @param date The refrence date to which to add the days
   * @param days The number of days to be added.
   * @returns The new date
   */
  addDays(date:Date, days:number):Date {
    var newdate = new Date(date);
    newdate.setDate(date.getDate() + days);
    return newdate;
  }

  /**
   * Creates a list of dates between 2 dates
   * @param startDate The date from which to start the list
   * @param stopDate The date from which to end the list
   * @returns A list of dates
   */
  getDates(startDate:Date, stopDate:Date):Array<Date> {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = this.addDays(currentDate, 1);
    }
    return dateArray;
  }

  /**
   * Renders the the Burn Down chart
   * @returns react node with the table element
   */
  public render(): React.ReactNode {

    const dates = this.getDates(this.props.startDate, this.props.endDate);
    console.log(dates);
    const labels = dates.map((item, i)=>i+1);
    const assignedHours = this.props.taskData.reduce((partialSum, item) => partialSum + (!item.completionDate || this.props.startDate<item.completionDate ? item.units : 0), 0);
    const remainingHoursData = dates.map((date, i) => date > this.props.currentDate ? null : this.props.taskData ? this.props.taskData.reduce((partialSum, item) => partialSum + (!item.completionDate || date < item.completionDate ? item.units : 0), 0) : 0);
    const targetHoursData = dates.map((date, i) => (dates.length-1-i)/(dates.length-1)*assignedHours);
    const availabilityHoursData = dates.map((date, i) => this.props.availabilityData ? this.props.availabilityData.reduce((partialSum, item) => partialSum + (date < item.date ? item.units : 0), 0) : 0);
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        }
      }
    };
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Remaining',
          data: remainingHoursData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Target',
          data: targetHoursData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Availability',
          data: availabilityHoursData,
          borderColor: 'rgb(162, 235, 53)',
          backgroundColor: 'rgba(162, 235, 53, 0.5)',
        }
      ],
    };
    return (
      <Line style={{width:'100%',height:'100%'}} options={options} data={data} />
    )
  }
}
