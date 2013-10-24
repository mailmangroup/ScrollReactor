ScrollReactor
=============

A minimal javascript library for animating parts of long pages as they scroll into view.

### Usage

#### Include Stylesheet in Header & Script in Footer
```html
	<link rel="stylesheet" href="scrollreactor.css">
</head>
<body>
...
	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script src="js/scrollreactor.js"></script>
</body>
</html>
```

### Add Animation Effect

Simply wrap your animation in the **SR.addEffect** function.

```javascript

SR.addEffect('myAnimation',{
	enter: function() {
		
		// ANIMATION
		
	},
	exit: function() {
		
		// RESET TO DEFAULT STATE
	
	}
});


```

Then add the label to the DOM element you want to trigger the animation.

```html

<div sr-effect="animationLabel">
	<p>The animation 'myAnimation' will be triggered when this content enters the viewport.</p>
</div>

```
