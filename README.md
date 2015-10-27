FOMCyclicals
=============

Bless me father, for I have $.

The goal is to create a text geerator that merges Catholic Papal Encyclicals with Federal Open Markets Committee announcements. I would like there to be some kind of slider that allows people to select the ratio.

## ＄ ----☉------------ ✞

Todo
----

 - [x] Set up scraper
 - [ ] Prep corpus
 - [ ] Read files into corpos
 - [ ] Use nltk for basic text gen from each corpus (use `generate`)
 - [ ] Try combining the corpi
 - [ ] Combine corpi into JSON file
 - [ ] Create simple js client


Installation
-------------

The corpus is scraped using nodejs to pull from the following sources:

 * [The FRB Board of Governers FOMC Page](http://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) (note that I am only pulling recent announcements, and there may be a better resource for these)
 * [gcatholi.org's Papal Enciclical library](http://www.gcatholic.org/documents/data/type-PEN.htm)

To install and scrape the corpus run the following:

```bash
npm install
node scraper.js
```

I'm using virtualenv for the python stuff project. To set up the virtual env :

```bash
source venv/bin/activate
```

Development
-----------