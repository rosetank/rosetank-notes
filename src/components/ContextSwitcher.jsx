import React, { useState, useEffect, Fragment, memo } from 'react';
import clsx from 'clsx';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router-dom';
import { useAllDocsData } from '@theme/hooks/useDocs';
import { string } from 'prop-types';
import {
  FcDocument,
  FcGlobe,
  FcCalendar,
  FcLinux,
  FcCloseUpMode,
  FcConferenceCall,
  FcSurvey,
  FcIdea,
  FcFinePrint,
  FcVoicePresentation,
  FcReadingEbook,
  FcLock,
  FcSupport,
  FcAcceptDatabase,
  FcBusiness,
  FcManager,
} from 'react-icons/fc';
/* import {
  BriefcaseIcon,
  DatabaseIcon,
  DesktopComputerIcon,
  CalendarIcon,
  HandIcon,
} from '@heroicons/react/solid'; */

const CONTEXTS = [
  {
    id: 'business',
    name: 'Business',
    icon: FcBusiness,
  },
  {
    id: 'data',
    name: 'Data',
    icon: FcAcceptDatabase,
  },
  {
    id: 'digital-environments',
    name: 'Digital Environments',
    icon: FcLinux,
  },
  {
    id: 'planning',
    name: 'Planning',
    icon: FcCalendar,
  },
  {
    id: 'divertisty-and-inclusion',
    name: 'Divertisty and Inclusion',
    icon: FcGlobe,
  },
  {
    id: 'legislation',
    name: 'Legislation',
    icon: FcDocument,
  },
  {
    id: 'careers',
    name: 'Careers',
    icon: FcConferenceCall,
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: FcVoicePresentation,
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: FcCloseUpMode,
  },
  {
    id: 'digital-analysis',
    name: 'Digital Analysis',
    icon: FcSurvey,
  },
  {
    id: 'fault-analysis',
    name: 'Fault Analysis',
    icon: FcFinePrint,
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: FcReadingEbook,
  },
  {
    id: 'security',
    name: 'Security',
    icon: FcLock,
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: FcIdea,
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: FcSupport,
  },
  {
    id: 'esp',
    name: 'ESP',
    icon: FcManager,
  },
];

const getContext = (id) => CONTEXTS.find((context) => context.id === id);

export const getCurrentPageInfo = () => {
  return window.location.pathname.split('/').slice(1);
};

const pathExists = (path, data) => {
  return data.docs.some((doc) => doc.path === path);
};

const ContextSwitcher = ({ className }) => {
  const [context, setContext] = useState(CONTEXTS[0]);
  const data = useAllDocsData();
  const history = useHistory();

  useEffect(() => {
    const [doc] = getCurrentPageInfo();

    const currContext = getContext(doc);
    if (currContext && currContext.id !== context.id) {
      setContext(currContext);
    }
  }, []);

  const handleChange = (newValue) => {
    setContext(newValue);

    const [, ...docPath] = getCurrentPageInfo();

    const newDoc = newValue.id;

    let path = `/${newDoc}/${docPath.join('/')}`;

    const lastVersion = data[newDoc].versions.find(
      (version) => version.isLast === true
    );

    if (pathExists(path, lastVersion)) {
      // navigate to same document in the last version
      // append hash to path for navigating to anchor tags, if they exist
      if (window.location.hash) path += window.location.hash;
      history.push(path);
    } else {
      // navigate to the main doc of the last version.
      const { mainDocId } = lastVersion;
      history.push(`/${newDoc}/${mainDocId}`);
    }
  };

  return (
    <Listbox
      value={context}
      onChange={handleChange}
      className={clsx('relative', className)}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative flex items-center w-full h-12 py-2 pl-3 pr-10 text-left border-none rounded-lg outline-none cursor-pointer bg-background-100 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <context.icon
            className="h-8 mr-2"
            aria-hidden="true"
            alt={context.name}
          />
          <span className="block truncate lv0_link text-text">
            {context.name}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <div className="relative w-full">
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 w-full p-0 py-2 mt-1 overflow-auto text-base list-none rounded-md shadow-lg max-h-60 bg-background-100 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {CONTEXTS.map((context) => (
                <Listbox.Option
                  key={context.id}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 px-4',
                      active && 'bg-background-200'
                    )
                  }
                  value={context}
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <context.icon
                          className="h-8 mr-2"
                          alt={context.name}
                          aria-hidden="true"
                        />
                        <span
                          className={clsx(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal'
                          )}
                        >
                          {context.name}
                        </span>
                      </div>
                      {selected ? (
                        <span className="left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
};

ContextSwitcher.propTypes = {
  className: string,
};

export default memo(ContextSwitcher);
