# Triggering effects in child components from a parent component

2020-12-10

## Status

Pending

## Context

Our entry point code and main banner components are responsible for coordinating animation and state changes in child components. 
In reactive frameworks like React, Preact and Vue it's unusual / an anti-pattern to call methods of children, so we need 
a different mechanism to "expose" the methods of child components to parent component components.

Examples of this pattern:

* Start sliding in the banner after a period of time (exposing `BannerTransition.displayBanner`)
* Start animating the progress bar animation after the banner has finished sliding in (exposing `ProgressBar.startAnimation`)  
* Stop animating the slider when the user interacts with the form (exposing `Slider.onStopAutoplay`)
* Start sliding in the full page banner when the user clicks on the mini banner (exposing `FollowupTransition.displayBanner`)

## Decision Drivers
* Parents and children must be interchangeable for the different channels
* Children have grandchildren that might want to expose methods
* We want to use the Hooks API and function-based components wherever possible
* "Developer experience" - how easy is it to navigate and understand the code
* Pattern should be "portable" across reactive frameworks, so we don't have to rewrite too much code when switching 
  from Preact to Vue.

## Options
### `registerXXX` callbacks

This is how we currently solve the parent-child communication: On mount, the parent component has a variable that holds 
an empty function and passes a callback to the child component that overrides the function with a reference to the child 
method:

```jsx
function Parent() {
    const [ everythingOk, setEverythingOk ] = useState( true );
    const [ doSomething, setDoSomething ] = useState( ()=>{} );
    useEffect( () => {
        setTimeout( () => doSomething( everythingOk ), 1000 ); 
    });
    return <div>
        <Child registerDoSomething={setDoSomething} />
    </div>;
} 
```  

```jsx
function Child({registerDoSomething}) {
    const [ myState, setMyState ] = useState( 'red' );
    const changeMyState = isOk => isOk ? setMyState( 'green' ) :  setMyState( 'red' );
    useEffect( () => {
        registerDoSomething( changeMyState );
    }, [ registerDoSomething ] );
    return <div>
        Everything is {myState}
    </div>;
} 
```

### `ref` to child component

The parent holds a direct reference to the child component object. The child component is a class component with a 
method that can be called from the parent. This is literally "exposing" the methods of child components.

```jsx
function Parent(props) {
    const [ everythingOk, setEverythingOk ] = useState( true );
    const childRef = useRef();
    useEffect( () => {
        setTimeout( () => {
            if ( childRef.current ) {
                childRef.current.changeMyState(everythingOk);
            }
        }, 1000 );       
    });
    return <div>
        <Child ref={childRef} />
    </div>;
} 
```  

```jsx
class Child extends Component {
    constructor() {
        super();
        this.state = { myColor: 'red' }
    }
    changeMyState( isOk ) {
        isOk ? this.setState( 'green' ) : this.setState( 'red' );
    }
    render( props, state)  {
        return <div>
            Everything is {state.myColor}
        </div>;
    }
} 
```


### Event bus

Parents and children connect to the same event bus through a custom hook that returns a singleton.  
Parents *trigger* events that children may *handle*.

Events are classes with a `payload` property (read-only and built though the constructor).
The naming convention for events is "noun + verb in past tense". The event classes have a
static property that the event bus uses as a unique id for the event (Implementation note: use `Symbol` singleton in the module).  

```jsx
function Parent(props) {
    const [ everythingOk, setEverythingOk ] = useState( true );
    const eventBus = useEventBus();
    useEffect( () => {
        setTimeout( () => eventBus.trigger( new OkaynessHasChanged( everythingOk ) ), 1000 );  
    });
    return <div> <Child /> </div>;
} 
```  

```jsx
function Child() {
    const eventBus = useEventBus();
    const [ myState, setMyState ] = useState( 'red' );
    const changeMyState = isOk => isOk ? setMyState( 'green' ) :  setMyState( 'red' );
    useEffect( () => {
        eventBus.handle( OkaynessHasChanged, evt => changeMyState( evt.payload ) )
    } );
    return <div>
        Everything is {myState}
    </div>;
} 
```


### Command bus

The code is similar to the event bus, but conceptually the parents don't inform children of events that "happened" in 
the parent, but send commands to all children that are interested in these commands. Parents and children connect to the
same command bus through a custom hook that returns a singleton. Parents *dispatch* commands that children may *subscribe* to.

Commands are classes with a `payload` property (read-only and built though the constructor).
The naming convention for commands is "verb in present tense + optional noun". The command classes have a
static property that the command bus uses as a unique id for the command (Implementation note: use `Symbol` singleton in the module).  

```jsx
function Parent(props) {
    const [ everythingOk, setEverythingOk ] = useState( true );
    const commandBus = useCommandBus();
    useEffect( () => {
        setTimeout( () => commandBus.dispatch( new UpdateStatusView( everythingOk ) ), 1000 ); 
    } );
    return <div> <Child /> </div>;
} 
```  

```jsx
function Child() {
    const commandBus = useCommandBus();
    const [ myState, setMyState ] = useState( 'red' );
    const changeMyState = isOk => isOk ? setMyState( 'green' ) :  setMyState( 'red' );
    useEffect( () => {
        commandBus.subscribe( UpdateStatusView, command => command.execute( changeMyState ) )
    });
    return <div>
        Everything is {myState}
    </div>;
} 
```

The child example shows an optional inversion of control where the every `Command` class has an `execute` method that 
calls a callback with its payload, making the payload more private. 


### Animation state passed down as properties
The parent keeps an "animation state" object, passes individual values as properties to children. 
Children react to property changes by calling their methods. The state can either be binary to trigger the method once, 
a set of defined states (with the child triggering on specific transitions), or a counter to trigger the method multiple times. 

Children must not trigger the method on first render. We can implement this by making sure the "default" (untriggered) 
state is in the parent component is falsy (`0`, ``, `false`, `null`, `undefined` ) and the children trigger method 
only for truthy values. This repetitive code could be extracted into its own `useTriggerProp` hook.

In the Preact implementation, we must make sure the animation state update is immutable, see 
https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object

```jsx
function Parent(props) {
    const [ everythingOk, setEverythingOk ] = useState( true );
    const [ animationState, setAnimationState ] = useState( { shouldUpdateStatusView: 0 } ) ;
    useEffect(() => {
        setTimeout( () => setAnimationState( {
                ...animationState,
                shouldUpdateStatusView: animationState.shouldUpdateStatusView + 1,
            } ), 1000 ); 
    });
    return <div> <Child shouldUpdateStatusView={shouldUpdateStatusView} okState={everythingOk} /> </div>;
} 
```  

```jsx
function Child( { shouldUpdateStatusView, okState } ) {
    const [ myState, setMyState ] = useState( 'red' );
    const changeMyState = isOk => isOk ? setMyState( 'green' ) :  setMyState( 'red' );
    useEffect( () => {
        if ( shouldUpdateStatusView ) {
            changeMyState( okState );
        }
        
    }, [ shouldUpdateStatusView ]);
    return <div>
        Everything is {myState}
    </div>;
} 
```

The example above looks a bit convoluted. Some "animation triggers" could become simple properties combined with internal 
state or a specialized hook.  

```jsx
function Parent(props) {
    const [ everythingOk, setEverythingOk ] = useState( false );
    useEffect( () => {
            setTimeout( () => setEverythingOk( true ), 1000 ); 
        });
    return <div> <Child okState={everythingOk} /> </div>;
} 
```  

```jsx
function Child( { okState } ) {
    const [ myState, setMyState ] = useState( 'red' );
    const [ okChangeWasTriggered, setOkChangeWasTriggered ] = useState( false );
    const changeMyState = isOk => isOk ? setMyState( 'green' ) :  setMyState( 'red' );
    useEffect( () => {
        if ( !okChangeWasTriggered ) {
            changeMyState( okState );
            setOkChangeWasTriggered( true );
        }
    }, [ okState ] );
    return <div>
        Everything is {myState}
    </div>;
} 
```

## Pros and cons of Options

### `registerXXX` callbacks
#### Pros
- Currently used, no changes needed
- Flexibility to use function and property names that fit best

#### Cons
- An unfamiliar pattern for new developers
- Looking up what's happening means jumping between 3 places in the code - the child class, the call to the set function 
  in the parent class, the child component in the parent class and the register function
- It's hard to navigate in the IDE - jumping to the definition of the property results in the empty function instead of 
  the `registerXXX` function  
- The Parent class needs to define an additional `registerXXX` function
- The naming flexibility can lead to confusion. Might be better to use a naming convention and renaming existing methods.  


### `ref` to child component
#### Pro
The simple use case is easy

#### Cons
- Only works with direct parent-child relationships
- Can trigger re-render of parent when child changes
- We can't use functional components with hooks as children
- Forces children to implement a specific interface, otherwise calling a method from the parent will break.
- We always have to check for the `.current` property of the reference to avoid calling methods on an empty object


### Event Bus / Command Bus
#### Pros
- We can visualize/list the events/commands and their handlers, helping us to understand the timings
- Easier debugging by adding a logger middleware to the bus or looking at the registered handlers/subscribers
- Event handlers/command subscribers for grandchild components don't need to be passed as props through a child component, 
  but attach directly to the bus. 
- Easier code navigation in the IDE with "Go to usages" and "Go to definition"
- More type safety and intelligent IDE autocompletion through constructor parameters for the event
- Most portable solution: when switching from Preact to Vue, we only need to replace `useCommandBus`/`useEventBus` 
  (a utility function which returns the bus singleton from the module) with Vue's [`inject`](https://composition-api.vuejs.org/api.html#dependency-injection)
  function.  

#### Cons
- Danger to leave events/commands unhandled - more burden on the acceptance test
- Might be harder to understand
- In event handlers, the child components code at least conceptually "knows" about other components and their code to attach an event handler.
  This can lead to code dependencies. 
  Example: The progress bar must react to `bannerTransitionHasFinished`. This could be mitigated by a 
  "mapping" middleware, that translates component-specific events into more generalized events. 
  But it might be hard to always stick to the "noun + past tense verb" convention, and the mapper might soon resemble a command bus.
- It might be tempting to implement a `target` property in the event object, 
  breaking the independence of the event subscribers from event emitters.


### Animation State
#### Pros
- Most idiomatic solution
- Some type hinting with `PropTypes`, although the function parameters can't be hinted
- Flexibility to use function and property names that fit best 

#### Cons
- Implicit knowledge needed about the "don't trigger on first render" mechanism. This can be a source of errors in the 
  parent (initializing animation state with truthy value) or in the child (forgetting to implement the falsy check). 
  But we can get around that by using defined state constants instead of truthy/falsy values and using custom hooks for
  checking. 
- Potential source of errors in the parent component when developers forget to update the state in an immutable fashion
- If the child method needs a parameter, we either have to use two properties (one for the trigger, one for the value) 
  or have to wrap the value property in a "trigger only once" check. 
- No "back channel" (return value) from the child to the parent, although this might be a YAGNI feature and could be 
  solved with other mechanisms (callbacks in Preact, events in Vue).
- The naming flexibility can lead to confusion. Might be better to use a convention.

## Decision

TBD


## Consequences

TBD