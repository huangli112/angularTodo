import { Component, DoCheck, NgZone, OnInit } from '@angular/core';
import { SyncAsync } from '@angular/compiler/src/util';
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
export class AppComponent{
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = todos
  public selectContent: {
    id: number,
    title: string,
    done: boolean
  }[] = null
  public visibility: string = 'all'

  constructor(private zone: NgZone) {
    
  }

  addTodo(event): void {
    //获取事件文本框中的数据
    let val = event.target.value
    //获取事件数据 的最后一项
    let lastInfo = this.todos[this.todos.length - 1]

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
    this.dataToState()
  }
  get toggleAll() {
    //判断todos中的所有done 如果done的值是全为true则返回true 将得到的结果返回给表单  控制全选与全不选
    return this.todos.every(item => item.done)
  }
  set toggleAll(val) { //利用￥event获取当前全选按钮的状态值
    this.todos.forEach(item => item.done = val)//利用当前全选按钮的状态值来控制每一个表单项的checked状态
  }
  deleteItem(id: number) {
    // this.todos.splice(id,1)
    // console.log(id)
    this.todos = this.todos.filter(item => id !== item.id)
    this.dataToState()
  }
  //与变更检测相关的钩子函数DoCheck 览器中发生的任何异步事件都会触发变更检测机制（点击按钮，输入数据，数据从服务器返回） 
  //变更检测机制只是将组件属性的变化反应到模板上，不会改变组件属性的值

  saveItem(item, e) {
    //将修改后的值重新赋值给表单
    item.title = e.target.value
    //将修改后的编辑状态中的值赋值为空
    this.selectContent = null;
  }
  cancleItem(e) {
    if (e.keyCode == 27) {
      // 按下esc 取消编辑
      this.selectContent = null;
    }
  }
  autoFocus(input) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        input.focus()
      }, 0)
    })
  }
  get countRemain() {
    //过滤出未完成的任务的数量
    return this.todos.filter(item => !item.done).length
  }
  //清除所有完成的任务
  clearAllDone() {
    //将未完成的任务过滤出来重新赋值给todos = 过滤掉已完成的任务
    this.todos = this.todos.filter(item => !item.done)
  }

  //实现导航切换数据的功能
  // 1.提供一个属性，该属性会根据当前点击的链接返回过滤之后的数据(filterTodo)
  //2.提供一个链接来存储当前点击的链接标识（visibility 字符串   all active completed）
  //3.为链接添加点击事件 当点击导航链接时，改变   

  //利用生命周期函数来获取路径的hash值
  ngOnInit() {
    //将本地存储中的数据重新渲染到页面
    this.todos = this.recover()
    //hash路由改变时触发
    window.onhashchange = (event:HashChangeEvent)=>{
      this.onchange()
    }
    //实现当路由没有发生变化时保持数据的不变
    this.onchange()
}

  get filterTodo() {
    if (this.visibility === 'all') {
      return this.todos
    }
    else if (this.visibility === 'completed') {
      return this.todos.filter(item => item.done)
    }
    else if (this.visibility === 'active') {
      return this.todos.filter(item => !item.done)
    }
  }

  onchange() {
      let hash = window.location.hash.slice(1)
      switch (hash) {
        case '/':
          this.visibility = 'all'
          break;
        case '/active':
          this.visibility = 'active'
          break;
        case '/completed':
          this.visibility = 'completed'
    }
  }

  dataToState(){
    window.localStorage.setItem('todos',JSON.stringify(this.todos))//将组件实例中的任务项转换成字符串存储在本地存储中
  }

  recover() {
    const strData = window.localStorage.getItem('todos')

    return JSON.parse(strData)
  }
}
