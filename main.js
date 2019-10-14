const XmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const fs = require('fs');

const getXML = (file, lang) => {
    let p = new Promise(
        (resolve, reject) => {
            let qs = [];
            fs.readFile(file, 'utf8',
                (err, data) => {
                    const xml = data;
                    const ast = XmlReader.parseSync(xml);
                    const node = xmlQuery(ast).children().find('baseQuestions').children().each(
                        e => {
                            const c = xmlQuery(e);
                            const j = {
                                key: c.find('baseQuestion').attr('id'),
                                value: c.find('prompt').text(),
                                lang: lang
                            }
                            qs.push(j)
                        }
                    )
                    resolve(qs);
                }

            );

        }
    )

    return p;


}







const en = getXML('HK_EN_RULEBOOK_20190905_15080000.XML', 'en');
const zh = getXML('HK_ZH_RULEBOOK_20190905_15080000.XML', 'zh');

Promise.all(
    [en, zh]
).then(
    (
        results
    ) => {
         
        let data = results;
        let en = results[0];
        let zh = results[1];
        let keys  = en.map(
            x => x.key
        )
        
        const pairs = keys.map(
            k => {
                return {
                    id: k,
                    en: en.find(x => x.key == k).value,
                    zh: zh.find(x => x.key == k).value,

                }
            }

        )
        console.log(pairs)
    }
)