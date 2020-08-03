import { Component } from '@angular/core';
//定义数据
const todos = [{
  id: 1,
  title: '购物',
  done: false
},
{
  id: 2,
  title: '吃饭 ',
  done: true
},
{ 
  id: 3,
  title: '下班',
  done: false
},

]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = todos
  addTodo(event): void {
    //获取事件文本框中的数据
    let val = event.target.value
    //获取事件数据 的最后一项
    let lastInfo = this.todos[todos.length - 1]
    if (!val.length) {
      return //数据为空时返回none
    }
    this.todos.push({
      //如果数组长度为空 则id值为1 否则最后一项的id值+1
      id: lastInfo.id ? lastInfo.id + 1 : 1,
      title: val,
      done: false
    })
    //清除文本框
    event.target.value = ''
    console.log(this.todos)
  }
 
}

