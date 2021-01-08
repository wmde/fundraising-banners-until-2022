# Triggering effects in child components from a parent component

2020-12-15

## Status

Accepted

## Context

Our entry point code and main banner components are responsible for coordinating animation and state changes in child components. 
In reactive frameworks like React, Preact and Vue it's unusual / an anti-pattern to call methods of children, so we need 
a different mechanism to "expose" the methods of child components to parent component components.

Currently, these are:

* Start sliding in the banner after a period of time (exposing `BannerTransition.displayBanner`)
* Start animating the progress bar animation after the banner has finished sliding in (exposing `ProgressBar.startAnimation`)  
* Stop animating the slider when the user interacts with the form (exposing `Slider.onStopAutoplay`)
* Start sliding in the full page banner when the user clicks on the mini banner (exposing `FollowupTransition.displayBanner`)
* Start animating the text highlight (exposing `TextHighlight.animateHighlight`). *Not in use at the moment!*

## Decision Drivers
* Parents and children must be interchangeable for the different channels
* Children have grandchildren that might want to expose methods
* We want to use the Hooks API and function-based components wherever possible
* "Developer experience" - how easy is it to navigate and understand the code
* Pattern should be "portable" across reactive frameworks, so we don't have to rewrite too much code when switching 
  from Preact to Vue.
* Best practices - Single Responsibility and decoupling, avoiding duplicated code

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

#### Pro
The simple use case is easy and familiar.

#### Cons
- Only works with direct parent-child relationships
- Can trigger re-render of parent when child changes
- We can't use functional components with hooks as children
- Forces children to implement a specific interface, otherwise calling a method from the parent will break.
- We always have to check for the `.current` property of the reference to avoid calling methods on an empty object


### Event bus / Command Bus

#### Event bus

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

#### Command bus

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

The example above looks a bit convoluted. Some "animation triggers" could become simple properties combined picked up by the child component:

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


### A reactive data store
A reactive data store like [flux](https://facebook.github.io/flux/), [redux](https://redux.js.org) or [vuex](https://vuex.vuejs.org)
is a combination of the command bus and shared reactive state option. All components share the same state object where 
they can `subscribe` to property changes or `dispatch` actions that will trigger state changes.

There are several articles looking at the difference between keeping state in a store and using hooks/composition API.
Although the majority of articles recommends using a store, the described use cases for hooks are a better fit for our 
situation, since we don't need the more advanced features of a store:

- https://medium.com/javascript-scene/do-react-hooks-replace-redux-210bab340672
- https://blog.logrocket.com/state-management-using-only-react-hooks/
- https://www.smashingmagazine.com/2020/04/react-hooks-best-practices/

#### Pros
- Established pattern
- Existing libraries
- Clearly defined "state machine" through testable reducers, that prevent invalid states
- Logging middleware for easy debugging and adding features

#### Cons
- More complexity because we have to define actions
- Compiled source code will get bigger, we add another dependency
- Not really portable (redux is for (P)React, Vuex is for Vue)
- We don't need many features of the libraries
- Weakens boundaries between components, without developer discipline any component can "talk" to any other component
- Temptation to move too much state into the store, making the components harder to understand


### CSS-Only solution
For effects, where we don't need to change the internal state of the child, we can define a set of class names that 
trigger different content, display or animations in the children. The class names are all inserted in the parent components,
the CSS for the child components defines how they display when the parent class changes.
 
```jsx
function Parent(props) {
    const [ everythingOk, setEverythingOk ] = useState( false );
    useEffect( () => {
            setTimeout( () => setEverythingOk( true ), 1000 ); 
        });
    return <div className={everythingOk ? 'child--this-is-fine' : 'child--this-is-not-normal' }>
            <Child />
          </div>;
} 
```  

```jsx
function Child( { okState } ) {
    return <div>
        <span>Everything is </span> 
        <span className="child_status child_status--this-is-fine">green</span>
        <span className="child_status child_status--this-is-not-normal">red</span>
    </div>;
} 
```

```css
/* Child.pcss */

/** Default view */
.child_status {
    display: none;
}
/** Status-specific views */
.child--this-is-fine .child_status--this-is-fine { 
    display: inline-block;
}
.child--this-is-not-normal .child_status--this-is-not-normal { 
    display: inline-block;
}
```

#### Pros
- Very performant (display changes and animations handled by browser, CSS compresses well)
- Less JS code and reactivity in the Child
- Fits well with BEM naming or other naming conventions

#### Cons
- Might duplicate content
- Not usable for components that need to keep and change state, triggered from the outside.

## Decision

We will try to find a "middle ground" between the animation state, reactive store and CSS-only approaches, favoring the 
CSS-only approach. The centerpiece class will be `AnimationState`, a class with the following responsibilities:

- Provide methods for changing state, e.g. `displayBanner`, `startProgressBar`, `startSlider`, `displayFollowupBanner`. 
  The methods make sure the state stays consistent and things happen in the right order.
- Generate reactive class names for the `Banner` component. Children can define CSS rules for these parent states.
- Provide reactive properties for children (Slider, FollowUpBanner) to trigger state changes.
- Listen to `transitionEnd` events and change the state accordingly, checking for marker classes in the event target 
  (see `FollowupTransition` for an example).

We will experiment how we define the "state machine" for coordinating dependent animations 
(e.g. banner display -> start progress bar -> start slider), possibly moving the code out of the `Banner` and `BannerPresenter`
class, either into `AnimationState` or into a separate `AnimationTransition` class. The goal here is to move all calls 
to `setTimeout` to a central place and to make the animation flow/dependency more visible.

We will introduce a `BannerDimension` class that measures the banner dimensions (with debouncing on viewport resize events)
and provides reactive `width` and `height` properties to children so they can adapt width/height dependent state. 

## Consequences

- `BannerTransition` and `FollowupTransition` components will probably become CSS-only classes, `ProgressBar` might lose 
  its method to start the progress.
- We can get rid of the `registerXXX` functions and their properties inside the `Banner` components
- BannerPresenter might become easier to understand and more structured.