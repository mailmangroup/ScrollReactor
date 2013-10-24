// DEBUG STATEMENTS (REMOVED BY UGLIFYJS)
if (typeof DEBUG === 'undefined') var DEBUG = true;


// SET UP PAGES
$('.sr-page').height( $(window).height() );


// CLASS : SCROLLREACTOR
// ---------------------------------------------------------------------------------------
var SR = {


	// SR OBJECT
	items: [],

	// DEBOUNCE TIMEOUT
	timeout: null,
	

	// NUM MS TO DEBOUNCE CHECK BY
	debounce: 500,
	
	
	// EFFECTS OBJECT
	fn: {},


	// FUNCTION : ADD EFFECT
	// -----------------------------------------------------------------------------------
	// ADD A CUSTOM EFFECT
	addEffect: function(label,fn) {
		
		this.fn[label] = fn;
		
		if (DEBUG) console.log('sr.addEffect',label);	
	},


	// FUNCTION : INITIALIZE
	// -----------------------------------------------------------------------------------
	// BINDS TO EVENTS
	init: function() {
	
		if (DEBUG) console.log('sr.init');
		
		var $this = this;
		
		// RUN SETUP
		this.setup();
		
		// ON WINDOW RESIZE
		$(window).resize(function() {
		
			// DEBOUNCE SETUP		
			if ($this.timeout) clearTimeout($this.timeout);
	
			// AFTER TIMEOUT › SETUP	
			$this.timeout = setTimeout(function() {
		
				// RE-RUN SETUP
				$this.setup();
				$this.timeout = null;			
			
			},$this.debounce);
		
		});
		
		// ON SCROLL
		$(window).on('scroll',function() {
		
			// DEBOUNCE CHECK		
			if ($this.timeout) clearTimeout($this.timeout);
	
			// AFTER TIMEOUT › CHECK	
			$this.timeout = setTimeout(function() {
	
				$this.check();
				$this.timeout = null;			
			
			},$this.debounce);
		
		});
	
	},


	// FUNCTION : SETUP SCROLL OBJECT
	// -----------------------------------------------------------------------------------
	// LOOPS THROUGH SC DOM ELEMENTS ADDS THEM TO SCROLL OBJECT
	setup: function() {
	
		if (DEBUG) console.log('sr.setup');
		
		var $this = this;
	
		// DEBUG : START TIMER
		if (DEBUG) var start = new Date().getTime();
	
		// LOOP THROUGH DOM ELEMENTS
		$.each($('[sr-effect]'),function(k,el) {
			
			// ELEMENT
			var el = $(el);
			
			var item = {};
				
			// NO ID > GENERATE ONE RANDOMLY
			var id = el.attr('id') || el.attr('id', 'sr' + Math.floor( Math.random() * 10000 ) ).attr('id');
			
			// CHECK OBJECT ALREADY EXISTS
			var existing = $.map($this.items,function(i) {
				return i.id == id ? i : null;
			});
			
			// ELEMENT ALREADY HAS OBJECT
			if (existing.length > 0) item = existing[0];
			
			// CREATE NEW OBJECT
			else item = {
				id: id,
				start: el.offset().top,
				end:  el.offset().top + el.height(),
				effect: el.attr('sr-effect'),
				enter: el.attr('sr-enter') || false,
				exit: el.attr('sr-exit') || false,
				state: el.attr('sr-state') || true,
				busy: false
			};
			
			// TODO : SUPPORT jQUERY FUNCTIONS
//			if (item.enter.charAt(0) === '$' && typeof $.fn[item.enter.substr(2)] === 'function') {
//				var fn = item.enter.substr(2);				
//				console.log('$(\'#'+id+'\')['+fn+']();');
//				item.enter = $('#'+id)[item.enter.substr(2)]();
//			}
			
			// CHECK FUNCTION IN effect STRING EXISTS
			if (typeof $this.fn[item.effect] === 'object') {
					
				// ADD ENTER EFFECT
				if (typeof $this.fn[item.effect].enter === 'function') item.enter = $this.fn[item.effect].enter;

				// ADD EXIT EFFECT
				if (typeof $this.fn[item.effect].exit === 'function') item.exit = $this.fn[item.effect].exit;
				
			} else {
			
				console.log('effect not found',item.effect);
			
			}
			
			// PUSH OBJECT INTO EVENTS ARRAY
			if (existing.length == 0) $this.items.push(item);
			else $this.items = $.map($this.items,function(i) {
				return i.id == item.id ? item : i ;
			});
		
		}); // END FOR LOOP
						
		// RUN CHECK
		this.check();
			
		// RECORD EXECUTION TIME
		if (DEBUG) console.log((new Date().getTime() - start)+'ms');
	
	},
	
	
	// FUNCTION : CHECK
	// -----------------------------------------------------------------------------------
	// LOOPS THROUGH SC OBJECT CHECKS IF IN VIEWPORT AND RUNS ANIMATIONS OR RESETS
	check: function() {
	
		if (DEBUG) console.log('sr.check');
	
		// SET VIEWPORT
		var viewport = {
			start: $(window).scrollTop(),
			end: $(window).height() + $(window).scrollTop()
		};
		
		// LOOP ITEMS ARRAY
		for (var i = 0; i < this.items.length; i++) {
		
			var item = this.items[i];

			// ON SCREEN BUT NOT VISIBLE & NOT BUSY > ENTER
			if ( item.start > viewport.start && item.end < viewport.end ) {
			
				if ( !item.state && !item.busy ) {
					
					//if (DEBUG) console.log('ENTER '+item.enter);
					
					// RUN EFFECT
					if (typeof item.enter === 'function') item.enter();
				
					// ENTER COMPLETE > SET STATE TO TRUE
					this.items[i].state = true;
				
				}
	
			}
	
			// OFF SCREEN VISIBLE & NOT BUSY > EXIT		
			else if ( viewport.start > item.end || viewport.end < item.start) {
				
				if ( item.state && !item.busy ) {
				
					//if (DEBUG) console.log('EXIT '+item.exit);
				
					// RUN RESET
					if (typeof item.exit === 'function') item.exit();
				
					// EXIT COMPLETE > SET STATE TO FALSE
					this.items[i].state = false;
				
				}
				
			}
			
		} // END FOR LOOP
	
	},

};