/*
	Programmer: Lukasz Czerwinski 

	Library version: jQuery 1.7+ and jQuery UI 
    Copyright (c) 2014 LUCKY JQUERY // Lukasz Czerwinski

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

(function($){

$.fn.eliteBoxMenu = function(settings){ 
	//Global variables 
	var $ul, $mainItems, heightIts, $item, srcImage, hColor, $subItem, $subMenu, posX;

	//Default settings
	settings = jQuery.extend({
		Speed			: 350,			//Speed animations 
		mainHeight		: 60,			//Default height of $mainItems
		mainWidth		: 170,			//Default width of $mainItems 
		hoverColor		: '#15b1d2',	//Default color for item hover if don't set in attribute
		method			: 'mouseenter',	//Default method to do an action (mouseenter or click)
		rwdFrom			: 980			//Start Restponsive Web Design 
	}, settings);
	 
	/*Define basic elemments */ 
	$ul = $(this),
	//Select Main Items
	$mainItems = $ul.children('li').not($(this).find('ul li')).css({
		'height': settings.mainHeight,
		'width': settings.mainWidth 
	}),
	//set height
	heightIts = $mainItems.find('li:first').outerHeight()+5;

	//Rebuil item structure 
	$mainItems.each(function(i) {
			//Select the Item
			$item = $(this),
			//Get link to an image of the Item
			srcImage = $item.find('a:first').data('image'),
			//Get hover color of the Item
			hColor = $item.find('a:first').data('color'),
			//Select the Sub Item 
			$subItem = $item.find('ul'),
			//Select the Submenu
			$subMenu = $subItem.find('ul'); 
			//Check color
			if(hColor === undefined) {hColor = settings.hoverColor};
			//Create thumb and color of item
			$item.prepend('<div class="thumb"><img src="'+srcImage+'" alt="'+$item.find('span:first').text()+'" width="100%" /></div><div class="color"></div>')
				//Set color
				.find('.color').css('background-color', hColor);

				//$subItem
				if ($subItem.length) {
						//Set the width 
					    posX = settings.mainWidth;
					    //Check the last Item and change Sub Menu position 
						if($item.index() == $mainItems.length-1) posX = -settings.mainWidth;
						//Set position of Sub Item
						$subItem.css({'left': posX, 'top': settings.mainHeight}).hide().find('li').hide();
						//Set position of $subMenu
						if($subMenu.length) $subMenu.css('top', 0);
				};
	}); //End each(); 

	//Create RWD icon
	$ul.parent().before('<div class="menuRwd"><a href="#"></a></div>');
	//Initialize
	_initEliteMenu($mainItems, $subItem, heightIts, settings);
}; //End fn.eliteBoxMenu

/*////// Global Functions //////*/
	//Declare variables
	var toCheckRWD, eType, $this, sub, subHeight, anotherItems, anotherSub, properties, rwdIcon, menuDiv;
	//Start
	function _initEliteMenu(mItems, sItems, heightItem, settings) {
		//Mouse events
		mItems.off().on('click mouseenter mouseleave', function(event) {
			eType = settings.method;
			if(eType == 'click' && event.type != 'mouseenter' && event.type != 'mouseleave'|| eType == 'mouseenter' && !toCheckRWD && event.type != 'click' || eType == 'mouseenter' && event.type == 'mouseleave' && !toCheckRWD || toCheckRWD && event.type == 'click' ) {
				$this = $(this),
				//Set sub
				sub = $this.find('ul').first(),
				//Set height hover 
				subHeight = (sub.length) ? sub.height() : 140,
				//Select another items
				anotherItems = mItems.parent('ul').find('.active').not($this),
				//Select another sub
				anotherSub = anotherItems.find('ul');
				//Hide another
				OpenOrHide(anotherItems, anotherSub, subHeight, settings);
				//do it
				OpenOrHide($this, sub, subHeight, settings);
			}
			if(eType == 'click' || event.type == 'click' && toCheckRWD) event.preventDefault();
		});
		//Select menu
		menuDiv = mItems.parent('ul').parent('div'),
		//RWD Icon
		rwdIcon = $('.menuRwd');
		rwdIcon.find('a').off().on('click', function(event) {
			/* Act on the event */ 
			if (!rwdIcon.is('.active')) {
				//Toggle active icon
				rwdIcon.toggleClass('active', true);
				//Show menu
				menuDiv.animate({'left': '+='+settings.mainWidth}, settings.Speed, 'easeOutBack');
				//rwd Icon animate 
				rwdIcon.animate({'left': '+='+settings.mainWidth}, settings.Speed, 'easeOutBack');
			} else{
				//Toggle active icon
				rwdIcon.toggleClass('active', false);
				//Hide another
				if(mItems.parent('ul').find('.active').length) OpenOrHide(mItems.parent('ul').find('.active'), mItems.parent('ul').find('.active > ul'), settings.mainHeight, settings);
				//Hide menu
				menuDiv.animate({'left': '-='+settings.mainWidth}, settings.Speed, 'easeOutBack');
				//rwd Icon animate 
				rwdIcon.animate({'left': '-='+settings.mainWidth}, settings.Speed, 'easeOutBack');
			};
			
			event.preventDefault();
		});
		//Load and Resize
		$(window).on('load resize', function() {
			//RWD
			_rwdMenu(mItems, settings);
				//Hide another
				if(mItems.parent('ul').find('.active').length) OpenOrHide(mItems.parent('ul').find('.active'), mItems.parent('ul').find('.active > ul'), settings.mainHeight, settings);
		});
	}
	function OpenOrHide(item, subItem, heightHover, settings) {
		//Clear properties
		// properties = {};
		if (!item.is('.active')) {
			//Enable active class
			item.toggleClass('active', true);
			/*Set animation properties*/
				//For normal design
				if(!toCheckRWD) {
					properties = {
						heightThumb: (130*1.5 < item.find('img').width()) ? 130*1.2 : 130,
						heightItem: settings.mainHeight+heightHover,
						widthItem: settings.mainWidth,
						widthSub: settings.mainWidth,
						top: heightHover/1.6
					};
				} else {
					//For responsive Web Design
					properties = {
						heightThumb: heightHover/1.7,
						heightItem: heightHover,
						widthItem: settings.mainWidth,
						widthSub: settings.mainWidth,
						top: heightHover/1.7
					};
					//Animate item heights
					item.stop(true, false).animate({'height': properties.heightItem}, settings.Speed/1.5, 'easeInOutBack');
				}
		} else {
			//Disable active class
			item.toggleClass('active', false);
			/*Set animation properties*/
				//For normal design
				if(!toCheckRWD) {
					properties = {
						heightThumb: 0,
						heightItem: 0, //For color
						widthItem: settings.mainWidth,
						widthSub: 0,
						top: 0
					};
				} else {
					//For responsive Web Design
					properties = {
						heightThumb: 0,
						heightItem: 0, //For color
						widthItem: settings.mainWidth,
						widthSub: 0,
						top: 0
					};
				}
					//Animate item heights
					if(item.height() > settings.mainHeight) item.stop(true, true).animate({'height': settings.mainHeight}, settings.Speed, 'easeInOutBack');
		}; 
			//Animations 
			item.find('.color').stop(true, false).animate({'height': properties.heightItem}, settings.Speed, 'easeInOutElastic').addBack()
					.find('a:first').stop(true, false).animate({'top': properties.top}, settings.Speed, 'easeInOutQuint').addBack()
						.find('.thumb, img').stop(true, false).animate({'height': properties.heightThumb }, settings.Speed, 'easeInOutElastic');

							//Show the submenu
							if(subItem.length) {
								subItem.stop(true, false).toggle(125).animate({'width': properties.widthSub }, settings.Speed, 'easeOutBounce').find('li').stop(true, false).fadeToggle(90).
									find('a').click(function() { 
										window.location = $(this).attr('href'); 
									});
							}
	}
	//Responsive
	function _rwdMenu(mItems, settings){		
		//Check the sizes for RWD
		toCheckRWD = window.innerWidth < settings.rwdFrom;
			//Troggle RWD
			if (toCheckRWD) {  
				mItems.parent('ul').toggleClass('rwd', true);
			} else{ 
				mItems.parent('ul').toggleClass('rwd', false).parent().removeAttr('style');
				rwdIcon.removeAttr('style').toggleClass('active', false);
			}; 
	}

})(jQuery); 
