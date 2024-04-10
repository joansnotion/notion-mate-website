import * as React from 'react'

import * as types from 'notion-types'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import cs from 'classnames'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

const ToggleThemeButton = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  )
}

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  const openPay = () => {
    if ((window as any).KodePay) {
      let plan_id = "prod_15d0256464a84f07";

      document.body.style.overflow = "hidden";
      const divUI = document.createElement("div");

      const modelStyle = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      overflow-y:hidden;
      z-index: 999998;
      `;

      const mcontentStyle = `
      width: 340px;
      height: 220px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      z-index: 999999;
      `;
      divUI.innerHTML = `
        <div id="kodepay-modal" class="kodepay-modal" style="${modelStyle}">
          <div class="kodepay-modal-content" style="${mcontentStyle}">
            <h4>Type of currency</h4>
            <div style="display: flex;gap: 4px;margin-bottom: 6px;">
              <input id="discountcode" type="text" placeholder="Enter discount code" /
              style="height: 32px;">
            </div>
            
            <div style="display: flex;gap: 16px;align-items: center;justify-content: center;" class="notion-header">
              <button id="kodepayusd" class="breadcrumb button">&nbsp;&nbsp;&nbsp;&nbsp;USD&nbsp;&nbsp;&nbsp;&nbsp;</button>
              <button id="kodepaycny" class="breadcrumb button">&nbsp;&nbsp;&nbsp;&nbsp;CNY&nbsp;&nbsp;&nbsp;&nbsp;</button>
            </div>
          </div>
        </div>
      `;

      const calcHash = (s) => {
        let hash = 0, i, chr;
        if (s.length === 0) return hash;
        for (i = 0; i < s.length; i++) {
          chr = s.charCodeAt(i);
          hash = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      }

      divUI.onclick = function (e) {
        const discountcode = (divUI.children[0].children[0].children[1].children[0] as HTMLInputElement).value;
        if (calcHash(discountcode) === 218557712) {
          plan_id = "prod_085484b177ea4328";
        }

        if (e.target === divUI.children[0]) {
          document.body.style.overflow = "auto";
          divUI.remove();
        } else if (e.target === divUI.children[0].children[0].children[2].children[0]) {
          document.body.style.overflow = "auto";
          divUI.remove();

          window['KodePay'].open_payment_choose_page(plan_id, 'usd').then((res: any) => {
            console.log(res);
          });
        } else if (e.target === divUI.children[0].children[0].children[2].children[1]) {
          document.body.style.overflow = "auto";
          divUI.remove();

          window['KodePay'].open_payment_choose_page(plan_id, 'cny').then((res: any) => {
            console.log(res);
          });
        }
      };

      document.body.appendChild(divUI);

    }
  };

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <div
            onClick={openPay} 
            className={cs(styles.navLink, 'breadcrumb', 'button')}>
            Subscribe
          </div>

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
