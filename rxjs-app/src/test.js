import {Observable} from 'rxjs'

new Observable((subscriber)=>{
    subscriber.next(1)
    subscriber.next(2)
    setTimeout(()=>{
        subscriber.next(3)
        subscriber.complete()
    }, 1000)
}).subscribe({
    next(res){console.log("res",res)},
    error(err){console.log(error)},
    complete(){console.log('complete')}
})

console.log('peep')